"use strict";
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

module.exports = {
  entry: [
    "./src/Examples/StaticPage/App.js" // change this to whatever example you want to build
  ],
  output: {
    path: `${__dirname}/build`,
    filename: "app.js"
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/,
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react']
        }},
      { test: /\.scss$/, loader: 'style-loader!css-loader?modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader'},
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.(svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "svg-sprite-loader?" + JSON.stringify({
        prefixize: false
      })}

    ]
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".js", ".jsx"]
  },
  plugins: [
    // TODO: Figure out why this had to be added in the first place. No idea why anyone would use this.
    // Might be needed by the CSS Modules built in plugin to apply hash-prefixed/isolated CSS styles
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
};