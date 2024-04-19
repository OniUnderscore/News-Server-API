const { fetchTopics } = require("../models/topic-model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(({ rows }) => {
      const topics = rows;
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
