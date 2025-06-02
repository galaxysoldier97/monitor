const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = {
  NODE_ENV: 'production',
  _API_EQUIPMENTS: '',
  _API_RESOURCES: '',
  _API_SERVICES: '',
  _API_ADDRESSES: '',
  KEYCLOAK_AUTH_PATH: '',
  KEYCLOAK_AUTH_REALM: '',
  KEYCLOAK_AUTH_SECRET: '',
  _UNM: '',
};

module.exports = {
  mode: 'production',
  // devtool: 'source-map', // enable this to debug in prod
  devServer: {
    noInfo: true,
  },
  entry: './src/index',
  target: 'web',
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: '[name].[chunkhash].js',
  },
  plugins: [
    new WebpackMd5Hash(),
    new webpack.EnvironmentPlugin(env),
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
  ],
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'url?name=[name].[ext]'},
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff&name=[name].[ext]',
      },
      {test: /\.ttf(\?v=\d+.\d+.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream&name=[name].[ext]'},
      {test: /\.svg(\?v=\d+.\d+.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml&name=[name].[ext]'},
      {test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=[name].[ext]'},
      {test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'},
      {test: /\.(scss|css)$/, use: ['style-loader', 'css-loader']},
    ],
  },
  externals: [
    {'../xlsx': 'var _XLSX'},
  ],
  node: {
    'fs': 'empty',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
