'use strict';
import getPaths from './paths';
const HtmlWebpackPlugin = require('html-webpack-plugin');

function generateHtmls(entry) {
  const chunks = Object.keys(entry);
  const paths = getPaths(process.cwd());
  const appSrc = paths.appSrc;
  const template = process.env.NODE_ENV === 'production' ? `${appSrc}/template-dist.html` : `${appSrc}/template-dev.html`;
  let plugins = [];
  // 生成HTML文件
  chunks.forEach((pathname) => {
    if (pathname === 'vendor' || pathname === 'mock') {
      return;
    }
    const name = pathname.split('/')[0];
    const conf = {
      title: name,
      filename: `${name}.html`,
      template: template,
      inject: 'body',
      minify: {
        removeComments: true,
        collapseWhitespace: false
      }
    };
    if (pathname in entry) {
      conf.chunks = ['mock', 'vendor', pathname];
      conf.hash = false;
    }
    plugins.push(new HtmlWebpackPlugin(conf));
  });
  return plugins;
}

module.exports = generateHtmls;
