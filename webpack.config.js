const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
  template: path.join(__dirname, 'client/src/index.html'),
  filename: path.join(__dirname, 'client/dist/index.html')
});

module.exports = {
  entry: "./client/src/index.js",
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: "[name].js"
  },
  plugins: [htmlPlugin],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
