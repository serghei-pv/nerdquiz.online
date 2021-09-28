const express = require("express");
const cors = require("cors");
const next = require("next");
var mongo = require("mongodb");
var MongoClient = require("mongodb").MongoClient;

const port = parseInt(process.env.PORT, 10) || 8100;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
let dbURL = "mongodb+srv://userGIS:GISecure@clusterraster.u3qcg.mongodb.net";
let dbClient = new mongo.MongoClient(dbURL);

connectToDb();

let userbase, quiz, winner;

app.prepare().then(() => {
  const server = express();
  server.use(cors());
  server.use(express.json());

  server.post("/save", (req, res) => {
    getQuiz(req.body.username).then(function (data) {
      if (data != "noGet") {
        quiz.updateOne({ _id: data }, { $set: { question: req.body.question, answer: req.body.answer } });
        res.send("saved succesfully");
      } else {
        quiz.insertOne({ question: req.body.question, answer: req.body.answer, ready: "false", username: req.body.username });
      }
    });
  });

  server.post("/create", (req, res) => {
    getQuiz(req.body.username).then(function (data) {
      if (data != "noGet") {
        quiz.updateOne({ _id: data }, { $set: { question: req.body.question, answer: req.body.answer, ready: "true" } });
        res.send("Quiz created succesfully");
      } else {
        quiz.insertOne({ question: req.body.question, answer: req.body.answer, ready: "true", username: req.body.username });
      }
    });
  });

  server.post("/load", (req, res) => {
    getQuizQA(req.body.username).then(function (data) {
      if (data != "noGet") {
        res.send(JSON.stringify(data));
      } else {
        res.send([]);
      }
    });
  });

  server.post("/list", (req, res) => {
    getQuizAll().then(function (data) {
      res.send(JSON.stringify(data));
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log("!");
  });
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
