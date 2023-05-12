const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const { getApi } = require("./controllers/api.controller");
const {
  getReviewById,
  getReviews,
  getCommentsByReviewId,
} = require("./controllers/reviews.controller");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api", getApi);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Bad request :(" });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  response
    .status(500)
    .send({ message: "Server error. Unfortunately, something went wrong..." });
});

module.exports = app;
