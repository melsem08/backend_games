const {
  selectReviewById,
  selectReviews,
  selectCommentsByReviewId,
} = require("../models/reviews.model");

exports.getReviewById = (request, response, next) => {
  const { review_id } = request.params;
  selectReviewById(review_id)
    .then((review) => {
      response.status(200).send({ review: review });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getReviews = (request, response) => {
  selectReviews().then((reviews) => {
    response.status(200).send({ reviews: reviews });
  });
};

exports.getCommentsByReviewId = (request, response, next) => {
  const { review_id } = request.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch((error) => {
      next(error);
    });
};
