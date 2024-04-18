exports.invalidID = (err, req, res, next) => {
  console.log("🚀 ~ err:", err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID" });
  }
  next(err);
};

exports.badBody = (err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Malformed Body" });
  }
  next(err);
};

exports.noUser = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(400).send({ msg: "User does not exist" });
  }
  next(err);
};

exports.customError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.internalError = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
