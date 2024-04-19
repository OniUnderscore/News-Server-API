exports.lengthCheck = (rows) => {
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  } else return rows;
};
