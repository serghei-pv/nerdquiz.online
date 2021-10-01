const express = require("express");
const next = require("next");
const mongo = require("mongodb");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { callbackify } = require("util");

const port = parseInt(process.env.PORT, 10) || 8100;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const dbURL = "mongodb+srv://userGIS:GISecure@clusterraster.u3qcg.mongodb.net";
const dbClient = new mongo.MongoClient(dbURL);

connectToDb();

let userbase, quiz, winner;
let participantsArray = [];

nextApp.prepare().then(() => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.post("/login", (req, res) => {
    getUser(req.body.username).then(function (data) {
      if (data == req.body.username) {
        res.send(data);
      }
    });
  });

  app.post("/save", (req, res) => {
    getQuiz(req.body.username).then(function (data) {
      if (data != "noGet") {
        quiz.updateOne({ _id: data }, { $set: { question: req.body.question, answer: req.body.answer } });
        res.send("saved succesfully");
      } else {
        quiz.insertOne({ question: req.body.question, answer: req.body.answer, ready: "false", username: req.body.username });
      }
    });
  });

  app.post("/create", (req, res) => {
    getQuiz(req.body.username).then(function (data) {
      if (data != "noGet") {
        quiz.updateOne({ _id: data }, { $set: { question: req.body.question, answer: req.body.answer, ready: "true" } });
        res.send("Quiz created succesfully");
      } else {
        quiz.insertOne({ question: req.body.question, answer: req.body.answer, ready: "true", username: req.body.username });
      }
    });
  });

  app.post("/load", (req, res) => {
    getQuizQA(req.body.username).then(function (data) {
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

  const server = http.createServer(app);
  const io = new Server(server, {
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
          let counter = 0;
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
          break;

        case "answer":
          for (let key in participantsArray) {
            if (participantsArray[key].username == data.username) {
              participantsArray[key].answer = data.answer;
              participantsArray[key].lock = "true";
            }
          }
          break;

        //
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
          let leader = {
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

      io.to(data.roomnumber).emit("update", JSON.stringify(participantsArray));
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

async function getUser(username) {
  try {
    let findUser = await userbase.findOne({
      username: username,
    });
    return findUser.username;
  } catch (e) {
    return "noGet";
  }
}

async function getQuiz(username) {
  try {
    let findQuiz = await quiz.findOne({
      username: username,
      ready: "false",
    });
    return findQuiz._id;
  } catch (e) {
    return "noGet";
  }
}

async function getQuizQA(username) {
  try {
    let findQuiz = await quiz.findOne({
      username: username,
      ready: "false",
    });
    return [findQuiz.question, findQuiz.answer];
  } catch (e) {
    return "noGet";
  }
}

async function getQuizAll() {
  try {
    let findQuiz = quiz.find({
      ready: "true",
    });
    allQuizzes = await findQuiz.toArray();
    return allQuizzes;
  } catch (e) {
    return "noGet";
  }
}
