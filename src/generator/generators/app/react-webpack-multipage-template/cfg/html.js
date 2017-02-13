'use strict';
const HtmlWebpackPlugin = require('html-webpack-plugin');

function generateHtmls(config) {
  let entry = config.entry;
  let chunks = Object.keys(entry);
  let template = process.env.REACT_WEBPACK_ENV === 'dist' ? './src/template-dist.html' : './src/template-dev.html';
  // 生成HTML文件
  chunks.forEach(pathname => {
    if (pathname == 'vendor') {
      return;
    }
    let name = pathname.split('/')[0];
    let conf = {
      title: name,
      filename: name + '.html',
      template: template,
      inject: 'body',
      minify: {
        removeComments: true,
        collapseWhitespace: false
      }
    };
    // 此处不明白，有待确认
    if (pathname in entry) {
      conf.chunks = ['vendor', pathname];
      conf.hash = false;
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
  });
  return config;
}

module.exports = generateHtmls;
