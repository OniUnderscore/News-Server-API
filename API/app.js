const db = require("../db/connection");
const express = require("express");
const { getTopics } = require("./controllers/topic-controller");
const { getAPI } = require("./controllers/meta-controller");
const {
  getArticle,
  getArticles,
  patchArticle,
} = require("./controllers/article-controller");
const {
  getComments,
  postComment,
  deleteComment,
} = require("./controllers/comment-controller");
const {
  invalidID,
  badBody,
  noUser,
  customError,
  internalError,
} = require("./middleware/errorhandling");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", (req, res, next) => {
  res.status(400).send({ msg: "Bad request" });
});

app.use(invalidID);

app.use(badBody);

app.use(noUser);

app.use(customError);

app.use(internalError);

module.exports = app;
