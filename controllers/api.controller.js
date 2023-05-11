const { selectApi } = require("../models/api.model");

exports.getApi = (request, response) => {
  selectApi().then((api) => {
    response.status(200).send({ api: api });
  });
};
