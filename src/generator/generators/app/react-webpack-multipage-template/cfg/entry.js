'use strict';
let glob = require('glob');

// 获取所有入口文件
let getEntry = function(globPath) {
  let entries;

  if (process.env.REACT_WEBPACK_ENV === 'dist') {
    entries = {
      vendor: ['react','react-dom', 'whatwg-fetch'] // 类库
    };
  } else {
    entries = {
      vendor: ['whatwg-fetch'] // 类库
    };
  }

  glob.sync(globPath).forEach(entry => {
    let pathname = entry.split('/').splice(-2).join('/').split('.')[0];
    entries[pathname] = [entry];
  });
  return entries;
};

module.exports = getEntry;
