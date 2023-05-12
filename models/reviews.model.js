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

exports.selectCommentsByReviewId = (reviewId) => {
  return this.selectReviewById(reviewId)
    .then(() => {
      return db.query(
        `SELECT * FROM comments WHERE review_id=($1)
  ORDER BY created_at DESC;`,
        [reviewId]
      );
    })
    .then((results) => {
      return results.rows;
    });
};

exports.insertCommentsByReviewId = (comment, reviewId) => {
  if (!comment.hasOwnProperty("username") || !comment.hasOwnProperty("body")) {
    return Promise.reject({
      status: 400,
      message: "Missing necessary property!",
    });
  } else if (
    typeof comment.username !== "string" ||
    typeof comment.body !== "string"
  ) {
    return Promise.reject({
      status: 400,
      message: "Incorrect property type!",
    });
  }
  comment.review_id = reviewId;
  const queryString = `INSERT INTO comments (body, review_id, author) VALUES ($1, $2, $3) RETURNING*;`;
  const queryValues = [comment.body, comment.review_id, comment.username];
  return this.selectReviewById(reviewId).then(() => {
    return db.query(queryString, queryValues).then(({ rows }) => {
      return rows[0];
    });
  });
};
