const { selectUsers, selectUserByUsername } = require("../models/users.model");

exports.getUsers = (request, response) => {
  selectUsers().then((users) => {
    response.status(200).send({ users: users });
  });
};

exports.getUserByUsername = (request, response, next) => {
  const { username } = request.params;
  selectUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user: user });
    })
    .catch((error) => {
      next(error);
    });
};
