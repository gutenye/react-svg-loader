const path = require('path')

module.exports = {
  entry: './App',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
  },

  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ },
      //{ test: /\.svg$/, use: ['babel-loader', {loader: '../', options: {es5: false, svgo: { pretty: true, plugins: [ { removeStyleElement: true } ] } }}] },
      { test: /\.svg$/, use: [{loader: '../', options: {svgo: { pretty: true, plugins: [ { removeStyleElement: true } ] } }}] },
    ]
  },

  devServer: {
    port: 3003,
    host: '0.0.0.0',
    //contentBase: path.resolve(__dirname, 'public'),
    historyApiFallback: true,
  },

  devtool: 'cheap-module-source-map',
}
