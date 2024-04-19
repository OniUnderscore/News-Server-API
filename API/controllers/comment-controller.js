const { fetchArticle } = require("../models/article-model");
const {
  fetchComments,
  saveComment,
  deleteComment,
} = require("../models/comment-model");
const { lengthCheck } = require("../models/meta-model");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticle(article_id)
    .then(({ rows }) => {
      return lengthCheck(rows);
    })
    .then((rows) => {
      return fetchComments(article_id);
    })
    .then(({ rows }) => {
      const comments = rows;
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  return fetchArticle(article_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return saveComment(article_id, comment);
    })
    .then(({ rows }) => {
      const comment = rows[0];
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return deleteComment(comment_id)
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Comment Not Found" });

      res.send(204);
    })
    .catch(next);
};
