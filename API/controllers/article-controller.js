const {
  fetchArticle,
  fetchArticles,
  updateVotes,
} = require("../models/article-model");
const { query } = require("../../db/connection");
const { lengthCheck } = require("../models/meta-model");
const { checkTopic } = require("../models/topic-model");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticle(article_id)
    .then(({ rows }) => {
      return lengthCheck(rows);
    })
    .then((rows) => {
      const article = rows[0];
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, order, sort_by } = req.query;
  return checkTopic(topic)
    .then(() => {
      return fetchArticles(topic, order, sort_by);
    })
    .then(({ rows }) => {
      return lengthCheck(rows);
    })
    .then((rows) => {
      const articles = rows;
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  return fetchArticle(article_id)
    .then(({ rows }) => {
      return lengthCheck(rows);
    })
    .then(([article]) => {
      return updateVotes(article, inc_votes);
    })
    .then(({ rows }) => {
      const article = rows[0];
      res.status(200).send({ article });
    })
    .catch(next);
};
