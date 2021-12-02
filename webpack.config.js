const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");


module.exports = {
    mode: 'development',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        },
  entry: './src/index.js',
  devServer: {
    static: './dist',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};