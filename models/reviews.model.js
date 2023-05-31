const db = require("../db/connection");
const { validCategories, checkReviewById } = require("../db/seeds/utils");

exports.selectReviewById = (reviewId) => {
  const queryString = `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count
       FROM reviews
       LEFT JOIN comments
       ON reviews.review_id = comments.review_id
       WHERE reviews.review_id = $1
       GROUP BY reviews.review_id;`;
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

exports.selectReviews = (category, sort_by = "created_at", order = "desc") => {
  const validSortQueries = {
    review_id: true,
    owner: true,
    title: true,
    category: true,
    review_img_url: true,
    created_at: true,
    votes: true,
    designer: true,
    comment_count: true,
  };
  const validSortOrders = { desc: true, asc: true };
  if (!validSortQueries.hasOwnProperty(sort_by)) {
    return Promise.reject({
      status: 400,
      message: "Sorting query is not valid",
    });
  }
  if (!validSortOrders.hasOwnProperty(order)) {
    return Promise.reject({
      status: 400,
      message: "Sorting order is not valid",
    });
  }
  const queryValues = [];
  let queryString = `SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url,
       reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) AS comment_count
       FROM reviews
       LEFT JOIN comments
       ON reviews.review_id = comments.review_id
       `;

  if (category) {
    queryString += `WHERE category = $1
       `;
    queryValues.push(category);
  }

  queryString += `GROUP BY reviews.review_id
       ORDER BY ${sort_by} ${order};`;

  return validCategories(category).then(() => {
    return db.query(queryString, queryValues).then((results) => {
      return results.rows;
    });
  });
};

exports.selectCommentsByReviewId = (reviewId) => {
  return checkReviewById(reviewId)
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
      message: "Now enough information to post a comment",
    });
  } else if (
    typeof comment.username !== "string" ||
    typeof comment.body !== "string"
  ) {
    return Promise.reject({
      status: 400,
      message:
        "The type of information you are trying to enter are not correct",
    });
  }
  comment.review_id = reviewId;
  const queryString = `INSERT INTO comments (body, review_id, author) VALUES ($1, $2, $3) RETURNING*;`;
  const queryValues = [comment.body, comment.review_id, comment.username];
  return checkReviewById(reviewId).then(() => {
    return db.query(queryString, queryValues).then(({ rows }) => {
      return rows[0];
    });
  });
};

exports.updateReviewById = (update, reviewId) => {
  if (!update.hasOwnProperty("inc_votes")) {
    return Promise.reject({
      status: 400,
      message: "Please pass a number of votes to change",
    });
  } else if (typeof update.inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      message:
        "The type of the votes property is not correct, has to be a number",
    });
  }
  const queryString = `UPDATE reviews SET votes = votes + ($1) WHERE review_id = ($2) RETURNING *;`;
  const queryValues = [update.inc_votes, reviewId];
  return checkReviewById(reviewId).then(() => {
    return db.query(queryString, queryValues).then(({ rows }) => {
      return rows[0];
    });
  });
};
