const path = require('path'),
      webpack = require('webpack'),
      ExtractTextPlugin = require('extract-text-webpack-plugin'),
      CleanWebpackPlugin = require('clean-webpack-plugin');

const folder = require('./config/folder');
const entry = require('./config/entry');

const ROOT = path.resolve(__dirname),
      SRC = path.resolve(ROOT, folder.src),
      DIST = path.resolve(ROOT, folder.dist);

const isProd = () => {
  return process.env.NODE_ENV === 'production';
};

module.exports =  {
  devServer: {
    contentBase: SRC,
    hot: true,
    inline: true,
  },
  devtool: isProd() ? '' : 'source-map',
  entry: entry.js,
  output: {
    filename: 'js/[name].js',
    path: DIST,
    //publicPath: '/',
  },
  resolve: {
    extensions: ['', '.js', '.styl', '.jade'],
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: SRC,
      }
    ],
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules|bower_components/,
        loader: 'babel',
      }, {
        test: /\.json$/,
        exclude: /node_modules|bower_components/,
        loader: 'json',
      }, {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('css!stylus'),
        include: path.resolve(SRC, folder.css),
      }, {
        test: /\.(woff2?|eot|ttf)$/,
        loader: 'file?name=font/[name].[hash].[ext]',
      }, {
        test: /\.jade$/,
        loader: 'html!jade-html',
      }, {
        test: /\.html$/,
        loader: 'html',
      }, {
        test: /\.(png|jpe?g|gif|svg)$/,
        loaders: [
          'file?name=img/[name].[hash].[ext]',
          'image-webpack?{bypassOnDebug: true, progressive: true}',
        ],
      },

    ],
  },

  jade: {
    pretty: isProd() ? false : true
  },

  stylus: {
    use: [
      require('nib'),
      require('autoprefixer-stylus')({
        browsers: [
          'last 2 versions',
        ]}),
    ],
    import: ['~nib/lib/nib/index.styl'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
    }),
    new CleanWebpackPlugin([folder.dist], {
      root: ROOT,
      verbose: false,
    }),
    new webpack.optimize.CommonsChunkPlugin('common', 'js/common.js'),
  ]
  .concat(entry.html, entry.css),

};
