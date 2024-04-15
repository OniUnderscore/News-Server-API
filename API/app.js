const db = require("../db/connection");
const express = require("express");
const { getTopics } = require("./controllers/controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(400).send({ msg: "Bad request" });
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  resp.status(500).send({ msg: "internal server error" });
});

module.exports = app;
