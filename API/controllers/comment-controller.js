const { fetchArticle } = require("../models/article-model");
const { fetchComments } = require("../models/comment-model");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticle(article_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return fetchComments(article_id);
    })
    .then(({ rows }) => {
      const comments = rows;
      res.status(200).send({ comments });
    })
    .catch(next);
};
