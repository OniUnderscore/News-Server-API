const db = require("../../db/connection");
const { lengthCheck } = require("./meta-model");

exports.fetchTopics = () => {
  const queryString = `SELECT * FROM topics`;
  return db.query(queryString);
};

exports.checkTopic = (topic) => {
  return new Promise((resolve, reject) => {
    if (!topic) reject(topic);
    else resolve();
  })
    .then(() => {
      return db.query("SELECT slug FROM topics WHERE slug = $1;", [topic]);
    })
    .then(({ rows }) => {
      return lengthCheck(rows);
    })
    .then(() => {
      return topic;
    })
    .catch((err) => {
      if (err === topic) return topic;
      else return Promise.reject(err);
    });
};
