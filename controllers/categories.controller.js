const { selectCategories } = require("../models/categories.model");

exports.getCategories = (request, response) => {
  selectCategories().then((categories) => {
    response.status(200).send({ categories: categories });
  });
};
