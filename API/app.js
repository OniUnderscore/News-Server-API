const db = require("../db/connection");
const express = require("express");
const { getTopics } = require("./controllers/topic-controller");
const { getAPI } = require("./controllers/meta-controller");
const { getArticle, getArticles } = require("./controllers/article-controller");
const { getComments } = require("./controllers/comment-controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.all("*", (req, res, next) => {
  res.status(400).send({ msg: "Bad request" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.log("🚀 ~ app.use ~ err:", err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
