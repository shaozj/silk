/**
 * Function that returns default values.
 * Used because Object.assign does a shallow instead of a deep copy.
 * Using [].push will add to the base array, so a require will alter
 * the base array output.
 */
'use strict';
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const srcPath = path.join(__dirname, '/../src');

/**
 * Get the default modules object for webpack
 * @return {Object}
 */
function getDefaultModules() {
  return {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        include: srcPath,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.sass/,
        loader: ExtractTextPlugin.extract('style', 'css!sass?outputStyle=expanded&indentedSyntax')
      },
      {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract('style', 'css!sass?outputStyle=expanded')
      },
      {
        test: /\.styl/,
        loader: ExtractTextPlugin.extract('style', 'css!stylus')
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(mp4|ogg|svg)$/,
        loader: 'file-loader'
      }
    ]
  };
}

module.exports = {
  srcPath: srcPath,
  publicPath: '/', // assets 资源路径
  port: 8002,
  getDefaultModules: getDefaultModules
};
