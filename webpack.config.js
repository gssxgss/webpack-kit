const path = require("path"),
      webpack = require("webpack"),
      ExtractTextPlugin = require("extract-text-webpack-plugin"),
      HtmlWebpackPlugin = require('html-webpack-plugin'),

      autoprefixer = require('autoprefixer'),
      precss = require('precss'),
      postcssAssets = require('postcss-assets');

const folder = require("./config/folder");
const entry = require("./config/entry");

const ROOT = path.resolve(__dirname),
      SRC = path.resolve(ROOT, folder.src),
      DEV = path.resolve(ROOT, folder.dev),
      PROD = path.resolve(ROOT, folder.prod);

const isProd = () => {
  return process.env.NODE_ENV === "production";
};

module.exports =  {
  devServer: {
    contentBase: DEV,
    hot: true,
    inline: true,
  },
  devtool: isProd() ? "" : "source-map",
  entry: entry,
  output: {
    filename: "[name].js",
    path: isProd() ? PROD : DEV,
    //publicPath: "/",
  },
  resolve: {
    extensions: ["", ".js", ".css", ".jade"],
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: isProd() ? "" : "eslint",
        include: SRC,
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|bower_components/,
        loader: "babel",
        //include: Path.resolve(SRC, folder.js),
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("css!postcss"),
        //include: Path.resolve(SRC, folder.css),
      },
      {
        test: /\.jade$/,
        loader: "html!jade-html",
      },
    ],
  },

  postcss: function () {
    return [
      autoprefixer,
      precss,
      postcssAssets({loadPaths: [folder.img]}),
    ];
  },

  jade: {
    pretty: isProd() ? false : true
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    //new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
    }),

    new webpack.optimize.CommonsChunkPlugin("common", "common.js"),
    new ExtractTextPlugin("app.css"),

    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(SRC, folder.html, "index.jade"),
      chunks: ['common', 'index'],
    }),
    new HtmlWebpackPlugin({
      filename: "404.html",
      template: path.resolve(SRC, folder.html, "404.jade"),
      chunks: ['common', 'error']
    })
  ],

};
