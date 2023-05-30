const {
  selectReviewById,
  selectReviews,
  selectCommentsByReviewId,
  insertCommentsByReviewId,
  updateReviewById,
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

exports.getReviews = (request, response, next) => {
  const { category, sort_by, order } = request.query;
  selectReviews(category, sort_by, order)
    .then((reviews) => {
      response.status(200).send({ reviews: reviews });
    })
    .catch((error) => {
      next(error);
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

exports.postCommentsByReviewId = (request, response, next) => {
  const { review_id } = request.params;
  insertCommentsByReviewId(request.body, review_id)
    .then((comment) => {
      response.status(201).send({ comment: comment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchReviewById = (request, response, next) => {
  const { review_id } = request.params;
  updateReviewById(request.body, review_id)
    .then((updatedReview) => {
      response.status(200).send({ review: updatedReview });
    })
    .catch((error) => {
      next(error);
    });
};
