import webpack from 'webpack';
import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const env = dotenv.config().parsed;

export default {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    noInfo: true,
  },
  entry: [
    './src/webpack-public-path',
    'webpack-hot-middleware/client?reload=true',
    './src/index',
  ],
  target: 'web',
  output: {
    path: `${__dirname}/src`,
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.EnvironmentPlugin(env),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      inject: true,
    }),
  ],
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file'},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
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
};
