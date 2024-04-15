const { fetchTable } = require("../models/topic-model");
const { readFile } = require("fs/promises");

exports.getAPI = (req, res, next) => {
  return readFile(`${__dirname}/../../endpoints.json`, "utf8").then(
    (endpoints) => {
      res.status(200).send({ endpoints });
    }
  );
};
