const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  context: __dirname,
  node: {
    __dirname: true
  },
  mode: process.env.NODE_ENV || "development",

  entry: {
    app: path.join(__dirname, "./client/app.js")
  },

  output: {
    path: path.join(__dirname, "__build__"),
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
    publicPath: "/__build__/"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      { test: /\.vue$/, use: ["vue-loader"] },
      { test: /\.css$/, use: ["vue-style-loader", "css-loader"] },
      { test: /\.less$/, use: ["vue-style-loader", "css-loader", "less-loader"] }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": path.join(__dirname, "client")
    }
  },
  plugins: [new VueLoaderPlugin(), new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()]
};
