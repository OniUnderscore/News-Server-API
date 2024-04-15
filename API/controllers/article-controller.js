const { verifyID } = require("../models/meta-model");
const { fetchArticle } = require("../models/article-model");

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
