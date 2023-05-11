const db = require("../db/connection");

exports.selectReviewById = (reviewId) => {
  if (isNaN(reviewId) === true) {
    return Promise.reject({ status: 400, message: "Review ID is invalid!" });
  }
  const queryString = `SELECT * FROM reviews WHERE review_id=($1)`;
  const queryValue = [reviewId];
  return db.query(queryString, queryValue).then((results) => {
    return results.rows;
  });
};
