const db = require("../../db/connection");

exports.fetchArticle = (article_id) => {
  return db.query(
    `SELECT articles.article_id, article_img_url, articles.author,articles.body,articles.created_at, title,topic,articles.votes,COUNT(comment_id)::INT AS comment_count FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
    [article_id]
  );
};

exports.fetchArticles = (
  topic,
  order = "asc",
  sort_by = "created_at",
  author
) => {
  const validSorts = [
    "article_id",
    "author",
    "title",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  if ((order !== "asc" && order !== "desc") || !validSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid Query" });
  }

  let queryString = `SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`;

  if (topic) {
    queryString += `
  WHERE topic = '${topic}'`;
  } else if (author) {
    queryString += `
  WHERE articles.author = '${author}'`;
  }

  queryString += `
  GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order};
  `;

  console.log(queryString);

  return db.query(queryString);
};

exports.updateVotes = (article, inc_votes) => {
  article.votes += inc_votes;
  return db.query(
    `UPDATE articles
  SET votes = $1
  WHERE article_id = $2
  RETURNING *`,
    [article.votes, article.article_id]
  );
};
