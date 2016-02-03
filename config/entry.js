const path = require("path");
const folder = require("./folder");
const get = (filename) => {
  return path.resolve(folder.src, folder.js, filename);
}

module.exports = {
  index: get("index.js"),
  error: get("error.js"),
};
