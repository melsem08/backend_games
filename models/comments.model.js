const db = require("../db/connection");
const { checkCommentById } = require("../db/seeds/utils");

exports.removeCommentById = (commentId) => {
  const queryString = `DELETE FROM comments WHERE comment_id=($1)`;
  const queryValues = [commentId];
  return checkCommentById(commentId).then(() => {
    return db.query(queryString, queryValues);
  });
};

exports.updateCommentById = (update, comment_id) => {
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
  const queryString = `UPDATE comments SET votes = votes + ($1) WHERE comment_id = ($2) RETURNING *;`;
  const queryValues = [update.inc_votes, comment_id];
  return checkCommentById(comment_id).then(() => {
    return db.query(queryString, queryValues).then(({ rows }) => {
      return rows[0];
    });
  });
};
