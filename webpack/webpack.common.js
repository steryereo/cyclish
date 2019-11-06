const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const env = dotenv.config().parsed;

module.exports = {
  entry: './client/src/index.js',
  output: {
    path: path.resolve(__dirname, '../client/dist'),
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../client/src/templates/index.pug'),
      filename: path.join(__dirname, '../client/dist/index.html')
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../client/src/templates/login.pug'),
      filename: path.join(__dirname, '../client/dist/login.html'),
      inject: false
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      chunkFilename: 'styles.css'
    }),
    new webpack.DefinePlugin({
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(env.GOOGLE_MAPS_API_KEY)
    })
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: 'pug-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|svg|jpg|gif|xml|ico|webmanifest)$/,
        use: ['file-loader']
      }
    ]
  }
};
