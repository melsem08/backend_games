const db = require("../db/connection");

exports.selectCategories = () => {
  //   console.log("Hi, Im in model");
  return db.query("SELECT * FROM categories;").then((results) => {
    return results.rows;
  });
};
