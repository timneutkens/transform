const withCSS = require("@zeit/next-css");
const webpack = require("webpack");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const config = {
  webpack(config, options) {
    config.node = {
      fs: "empty",
      module: "empty",
      net: "mock",
      tls: "mock"
    };

    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.DEV": JSON.stringify(options.dev),
        IN_BROWSER: !options.isServer,
        IS_DEV: options.dev
      }),
      new MonacoWebpackPlugin({
        output: "../../static",
        languages: [
          "json",
          "typescript",
          "css",
          "javascript",
          "html",
          "sql",
          "xml",
          "yaml",
          "rust",
          "markdown",
          "go",
          "graphql",
          "scala",
          "plaintext",
          "java"
        ],
        features: [
          "folding",
          "goToDefinitionMouse",
          "goToDefinitionCommands",
          "referenceSearch"
        ]
      })
    );

    config.module.rules.unshift({
      test: /\.worker\.ts/,
      use: {
        loader: "worker-loader",
        options: {
          name: "static/[hash].worker.js",
          publicPath: "/_next/"
        }
      }
    });

    config.output.globalObject = `this`;

    return config;
  },
  target: "serverless"
};

module.exports = withCSS(config);
