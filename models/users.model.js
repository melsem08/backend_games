const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((results) => {
    return results.rows;
  });
};

exports.selectUserByUsername = (username) => {
  const queryString = `SELECT * FROM users WHERE username = $1`;
  const queryValue = [username];
  return db.query(queryString, queryValue).then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "User with the entered name was not found",
      });
    }
    return results.rows[0];
  });
};
