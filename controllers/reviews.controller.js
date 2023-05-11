const { selectReviewById, selectReviews } = require("../models/reviews.model");

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
