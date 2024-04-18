const { fetchUsers } = require("../models/user-model");

exports.getUsers = (req, res, next) => {
  return fetchUsers().then(({ rows }) => {
    const users = rows;
    res.status(200).send({ users });
  });
};
