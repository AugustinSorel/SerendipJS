import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration } from "webpack";
import "webpack-dev-server";
import path from "path";

const config: Configuration = {
  mode: "development",
  entry: {
    bundle: path.resolve(__dirname, "./src/index.ts"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[contenthash].js",
    clean: true,
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "./dist"),
    },
    port: 3001,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css?$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
    }),
  ],
};

export default config;
