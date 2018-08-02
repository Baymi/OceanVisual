const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    vendor: ["react", "react-dom", "react-router"],
    app: ["babel-polyfill", "./src/index"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "assets/[name].[hash].js",
    chunkFilename: "assets/[name].[chunkhash].js"
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "src"),
        loader: "babel-loader",
        query: {
          presets: [
            "@babel/preset-react",
            {
              development: false
            }
          ],
          //   ["@babel/preset-react", { "development": true }],
          //   presets: [["es2015", { modules: false }], "stage-0", "react"],
          plugins: [
            "transform-async-to-generator",
            "transform-decorators-legacy"
          ]
        }
      },
      {
        test: /\.scss|css$/i,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            "postcss-loader",
            "resolve-url-loader",
            "sass-loader?sourceMap"
          ]
        })
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
        drop_console: true,
        screw_ie8: true
      },
      output: {
        comments: false
      }
    }),
    new ExtractTextPlugin("assets/styles.css"),
    new HtmlWebpackPlugin({
      hash: false,
      template: "./public/index.hbs"
    })
  ]
};
