const fs = require("fs/promises");

exports.selectApi = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((data) => {
    return data;
  });
};
