const { fetchTable } = require("../models/model");

const ENV = process.env.NODE_ENV || "development";

const dataPath = `${__dirname}/../../db/data/${ENV}-data`;
const data = require(dataPath);

exports.getTopics = (req, res, next) => {
  fetchTable("topics")
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
