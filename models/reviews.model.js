const db = require("../db/connection");

exports.selectReviewById = (reviewId) => {
  const queryString = `SELECT * FROM reviews WHERE review_id=($1)`;
  const queryValue = [reviewId];
  return db.query(queryString, queryValue).then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "Review not found :(",
      });
    }
    return results.rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url,
       reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) AS comment_count
       FROM reviews
       JOIN comments
       ON reviews.review_id = comments.review_id
       GROUP BY reviews.review_id
       ORDER BY reviews.created_at DESC;`
    )
    .then((results) => {
      return results.rows;
    });
};
