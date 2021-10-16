import * as Mongo from "mongodb";
import * as Http from "http";
import Express from "express";
import Next from "next";
import Cors from "cors";
import { NextServer } from "next/dist/server/next";
import { Server } from "socket.io";
import { Quiz, Participant } from "./interface";

const port: number = parseInt(process.env.PORT || "8100", 10);
const dev: boolean = process.env.NODE_ENV !== "production";
const nextApp: NextServer = Next({ dev });
const handle = nextApp.getRequestHandler();
const dbURL: string = "mongodb+srv://userGIS:GISecure@clusterraster.u3qcg.mongodb.net";
const dbClient: Mongo.MongoClient = new Mongo.MongoClient(dbURL);

connectToDb();

let userbase: Mongo.Collection;
let quiz: Mongo.Collection;
let winner: Mongo.Collection;
let allQuizzes: Quiz[];
let participantsArray: Participant[] = [];

nextApp.prepare().then(() => {
  const app = Express();
  app.use(Cors());
  app.use(Express.json());

  app.post("/register", (req, res) => {
    userbase.insertOne({
      username: req.body.username,
      password: req.body.password,
    });
    res.send(req.body.username);
  });

  app.post("/login", (req, res) => {
    getUser(req.body.username).then(function (data) {
      if (data[0] == req.body.username && data[1] == req.body.password) {
        res.send(data[0]);
      }
    });
  });

  app.post("/save", (req, res) => {
    getQuiz(req.body.username).then(function (data) {
      if (data != "noGet") {
        quiz.updateOne({ _id: data }, { $set: { question: req.body.question, answer: req.body.answer } });
        res.send("saved successfully");
      } else {
        quiz.insertOne({ question: req.body.question, answer: req.body.answer, ready: "false", username: req.body.username });
      }
    });
  });

  app.post("/create", (req, res) => {
    getQuiz(req.body.username).then(function (data) {
      if (data != "noGet") {
        quiz.updateOne({ _id: data }, { $set: { question: req.body.question, answer: req.body.answer, ready: "true" } });
        res.send("Quiz created successfully");
      } else {
        quiz.insertOne({ question: req.body.question, answer: req.body.answer, ready: "true", username: req.body.username });
      }
    });
  });

  app.post("/load", (_req, res) => {
    getQuizQA().then(function (data) {
      if (data != "noGet") {
        res.send(JSON.stringify(data));
      } else {
        res.send([]);
      }
    });
  });

  app.post("/list", (req, res) => {
    getQuizAll().then(function (data) {
      if (req.body.id == undefined) {
        res.send(JSON.stringify(data));
      } else {
        for (let key in data) {
          if (data[key]._id == req.body.id) {
            res.send(JSON.stringify(data[key]));
          }
        }
      }
    });
  });

  const server: Http.Server = Http.createServer(app);
  const io: Server = new Server(server, {
    cors: {
      allowedHeaders: ["*"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("message", (message) => {
      let data = JSON.parse(message.toLocaleString());

      switch (data.type) {
        case "host":
          socket.join(data.roomnumber);
          break;

        case "participant":
          console.log(data.username);
          if (data.username != null) {
            let counter: number = 0;
            socket.join(data.roomnumber);

            for (let key in participantsArray) {
              if (participantsArray[key].username == data.username) {
                counter++;
                if (counter == 1 && participantsArray[key].roomnumber != data.roomnumber) {
                  participantsArray[key] = {
                    username: data.username,
                    points: 0,
                    answer: "",
                    roomnumber: data.roomnumber,
                    lock: "false",
                  };
                }
              }
            }
            if (counter == 0) {
              participantsArray.push({
                username: data.username,
                points: 0,
                answer: "",
                roomnumber: data.roomnumber,
                lock: "false",
              });
            }
          }
          break;

        case "answer":
          for (let key in participantsArray) {
            if (participantsArray[key].username == data.username) {
              participantsArray[key].answer = data.answer;
              participantsArray[key].lock = "true";
            }
          }
          break;

        case "change":
          for (let key in participantsArray) {
            if (data.username == participantsArray[key].username) {
              if (data.points != null) {
                participantsArray[key].points += data.points;
              }
              if (data.lock != null && participantsArray[key].lock != "false") {
                participantsArray[key].lock = data.lock;
                participantsArray[key].answer = "";
              }
            }
          }
          break;

        case "continue":
          for (let key in participantsArray) {
            if (participantsArray[key].roomnumber == data.roomnumber) {
              participantsArray[key].lock = "false";
              participantsArray[key].answer = "";
            }
          }
          break;

        case "winner":
          let leader: Participant = {
            username: "",
            points: 0,
            answer: "",
            roomnumber: "",
            lock: "",
          };

          for (let key in participantsArray) {
            if (participantsArray[key].roomnumber == data.roomnumber) {
              if (participantsArray[key].points > leader.points) {
                leader = participantsArray[key];
              }
            }
          }

          winner.updateOne({ name: "winnerArray" }, { $push: { user: leader.username } });
          socket.send(JSON.stringify(leader));
          break;
      }

      let localParticipantsArray: Participant[] = [];
      for (let key in participantsArray) {
        if (data.roomnumber == participantsArray[key].roomnumber) {
          localParticipantsArray.push(participantsArray[key]);
        }
      }

      io.to(data.roomnumber).emit("update", JSON.stringify(localParticipantsArray));
    });
  });

  app.all("*", (req, res) => handle(req, res));

  server.listen(port, () => console.log("Next server is up and running"));
});

async function connectToDb() {
  await dbClient.connect();
  userbase = dbClient.db("nerdquiz").collection("user");
  quiz = dbClient.db("nerdquiz").collection("quizzes");
  winner = dbClient.db("nerdquiz").collection("misc");
}

async function getUser(username: string) {
  try {
    let findUser: Mongo.Document = <Mongo.Document>await userbase.findOne({
      username: username,
    });
    return [findUser.username, findUser.password];
  } catch (e) {
    return "noGet";
  }
}

async function getQuiz(username: string) {
  try {
    let findQuiz: Mongo.Document = <Mongo.Document>await quiz.findOne({
      username: username,
      ready: "false",
    });
    return findQuiz._id;
  } catch (e) {
    return "noGet";
  }
}

async function getQuizQA() {
  try {
    let findQuiz: Mongo.Document = <Mongo.Document>quiz.find({
      ready: "false",
    });
    let unfinishedQuiz: Quiz[] = await findQuiz.toArray();
    return unfinishedQuiz;
  } catch (e) {
    return "noGet";
  }
}

async function getQuizAll() {
  try {
    let findQuiz: Mongo.Document = <Mongo.Document>quiz.find({
      ready: "true",
    });
    allQuizzes = await findQuiz.toArray();
    return allQuizzes;
  } catch (e) {
    let noGet: Quiz[] = [];
    return noGet;
  }
}
