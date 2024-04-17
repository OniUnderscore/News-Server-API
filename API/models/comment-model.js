const db = require("../../db/connection");

exports.fetchComments = (article_id) => {
  return db.query(
    `SELECT * FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC`,
    [article_id]
  );
};

exports.saveComment = (article_id, comment) => {
  const username = comment.username;
  const body = comment.body;
  return db.query(
    `INSERT INTO comments(author, body, article_id)
  VALUES ($1,$2,$3)
  RETURNING *`,
    [username, body, article_id]
  );
};

exports.deleteComment = (comment_id) => {
  return db.query(
    `DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *`,
    [comment_id]
  );
};
