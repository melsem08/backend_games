const { selectCategories } = require("../models/categories.model");

exports.getCategories = (request, response) => {
  //   console.log("Hi, I'm in controller");
  selectCategories().then((categories) => {
    response.status(200).send({ categories: categories });
  });
};
