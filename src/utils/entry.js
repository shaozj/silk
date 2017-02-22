'use strict';
let glob = require('glob');

const isProduction = process.env.NODE_ENV === 'production';
// 获取所有入口文件
let getEntry = function(globPath, config) {
  let entries = {};

  if (isProduction) {
    entries = {
      vendor: ['react','react-dom', 'whatwg-fetch'] // 类库
    };
  } else if (!config.dll){
    entries = {
      vendor: ['whatwg-fetch'] // 类库
    };
  }

  glob.sync(globPath).forEach(entry => {
    let pathname = entry.split('/').splice(-2).join('/').split('.')[0];
    if (isProduction) {
      entries[pathname] = [entry];
    } else {
      entries[pathname] = [require.resolve('react-dev-utils/webpackHotDevClient'), entry];
    }
  });
  return entries;
};

module.exports = getEntry;
