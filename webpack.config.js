const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: [
    // "react-hot-loader/patch",
    "webpack-dev-server/client?http://0.0.0.0:3003",
    // "webpack/hot/only-dev-server",
    "babel-polyfill",
    "whatwg-fetch",
    "./src/index"
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, "public"),
    port: 3003,
    host: "0.0.0.0",
    publicPath: "/",
    historyApiFallback: true,
    disableHostCheck: true
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "app.[hash].js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [["es2015", { modules: false }], "stage-0", "react"],
          plugins: [
            "transform-async-to-generator",
            "transform-decorators-legacy"
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          `css-loader?${JSON.stringify({
            sourceMap: true,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            url: false,
            localIdentName: "[name]_[local]_[hash:base64:3]",
            // CSS Nano http://cssnano.co/options/
            minimize: false
          })}`,
          "postcss-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          `css-loader?${JSON.stringify({
            sourceMap: true,
            url: false,
            modules: false,
            minimize: false
          })}`//,
          // "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({ hash: false, template: "./public/index.hbs" }),
    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/)
  ]
};
