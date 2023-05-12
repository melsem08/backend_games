const { removeCommentById } = require("../models/comments.model");

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
