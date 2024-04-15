exports.verifyID = (id) => {
  if (isNaN(Number(id))) {
    return false;
  } else {
    return true;
  }
};
