var path = require('path');
var webpack = require('webpack');

module.exports = function (env) {
  return {
    entry: {
      main: './src/js/main.jsx',
      vendor: ['react', 'react-dom', 'react-bootstrap-table']
    },
    devtool: env === "prod" ? "cheap-module-source-map" : "inline-source-map",
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'src/dist'),
      publicPath: "/dist"
    },
    module: {
      rules: [{
        test: /\.jsx?/,
        loader: 'babel-loader',
        options: {
          presets: ["es2015", "react"]
        }
      }]
    },
    devServer: {
      contentBase: path.join(__dirname, "src"),
      publicPath: "/dist",
      compress: true,
      port: 8080,
      hot: true
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor' // Specify the common bundle's name.
      })
    ]
  }
}