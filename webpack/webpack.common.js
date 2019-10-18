const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
