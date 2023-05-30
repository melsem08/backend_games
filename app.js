const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const { getApi } = require("./controllers/api.controller");
const {
  getReviewById,
  getReviews,
  getCommentsByReviewId,
  postCommentsByReviewId,
  patchReviewById,
} = require("./controllers/reviews.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api", getApi);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentsByReviewId);
app.patch("/api/reviews/:review_id", patchReviewById);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/users", getUsers);

app.use((error, request, response, next) => {
  const errorLookUp = {
    "22P02": { status: 400, message: "Bad request :(" },
    23503: { status: 404, message: "Not found :(" },
    42703: { status: 404, message: "Sort category not found :(" },
  };
  if (errorLookUp.hasOwnProperty(error.code)) {
    response
      .status(errorLookUp[error.code]["status"])
      .send({ message: errorLookUp[error.code]["message"] });
  } else {
    next(error);
  }
  // if (error.code === "22P02") {
  //   response.status(400).send({ message: "Bad request :(" });
  // }
  //  else if (error.code === "23503") {
  //   response.status(404).send({ message: "Not found :(" });
  // } else {
  //   next(error);
  // }
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
