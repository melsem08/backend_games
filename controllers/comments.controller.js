const {
  removeCommentById,
  updateCommentById,
} = require("../models/comments.model");

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentById(comment_id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  updateCommentById(request.body, comment_id)
    .then((updatedComment) => {
      response.status(200).send({ comment: updatedComment });
    })
    .catch((error) => {
      next(error);
    });
};
