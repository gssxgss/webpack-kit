const path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      ExtractTextPlugin = require('extract-text-webpack-plugin'),
      folder = require('./folder');

const getJs = (filename) => {
  return path.resolve(folder.src, folder.js, filename);
}

const getHtml = (file, jsEntryArr) => {
    return new HtmlWebpackPlugin({
      filename: `${file}.html`,
      template: path.resolve(folder.src, folder.html, `${file}.jade`),
      chunks: jsEntryArr,
    })
};

module.exports = {
  js: {
    index: getJs('index.js'),
    error: getJs('error.js'),
  },
  html: [
    getHtml('index', ['common', 'index']),
    getHtml('404', ['common', 'error']),
  ],
  css: [
    new ExtractTextPlugin('css/app.css'),
  ]
};
