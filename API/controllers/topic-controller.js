const { fetchTable } = require("../models/topic-model");

exports.getTopics = (req, res, next) => {
  fetchTable("topics")
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
