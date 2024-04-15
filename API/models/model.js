const db = require("../../db/connection");
const format = require("pg-format");

exports.fetchTable = (table) => {
  const queryString = format("SELECT * FROM %I", table);
  return db.query(queryString).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Table is Empty" });
    } else return rows;
  });
};
