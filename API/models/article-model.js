const db = require("../../db/connection");

exports.fetchArticle = (article_id) => {
  return db.query(
    `SELECT * FROM articles
    WHERE article_id = $1;`,
    [article_id]
  );
};

exports.fetchArticles = () => {
  return db.query(`SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id;`);
};