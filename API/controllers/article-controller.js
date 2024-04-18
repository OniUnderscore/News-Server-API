const { verifyID } = require("../models/meta-model");
const {
  fetchArticle,
  fetchArticles,
  updateVotes,
} = require("../models/article-model");
const { query } = require("../../db/connection");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  return new Promise((resolve, reject) => {
    if (!verifyID(article_id)) {
      reject({ status: 400, msg: "ID is Malformed" });
    } else resolve();
  })
    .then(() => {
      return fetchArticle(article_id);
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not Found" });
      }
      const article = rows[0];
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  4;
  return fetchArticles(topic)
    .then(({ rows }) => {
      const articles = rows;
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  if (isNaN(Number(inc_votes))) next({ status: 400, msg: "Malformed Body" });

  return fetchArticle(article_id)
    .then(({ rows }) => {
      return new Promise((resolve, reject) => {
        if (rows.length === 0)
          reject({ status: 404, msg: "Article Not Found" });
        else resolve(rows[0]);
      });
    })
    .then((article) => {
      return updateVotes(article, inc_votes);
    })
    .then(({ rows }) => {
      const article = rows[0];
      res.status(200).send({ article });
    })
    .catch(next);
};
