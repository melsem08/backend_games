const db = require("../db/connection");

exports.selectCommentById = (commentId) => {
  const queryString = `SELECT * FROM comments WHERE comment_id=($1)`;
  const queryValue = [commentId];
  return db.query(queryString, queryValue).then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "Comment not found :(",
      });
    }
    return results.rows;
  });
};

exports.removeCommentById = (commentId) => {
  const queryString = `DELETE FROM comments WHERE comment_id=($1)`;
  const queryValues = [commentId];
  return this.selectCommentById(commentId).then(() => {
    return db.query(queryString, queryValues);
  });
};
