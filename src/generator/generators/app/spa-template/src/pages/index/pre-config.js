// 设置 __webpack_public_path__, 兼容日常、预发、线上环境
const js = document.scripts;
const url = js[js.length - 1].src.split('?')[0];
const urlSplit = url.split('/');
urlSplit.pop();
urlSplit.pop();
__webpack_public_path__ = urlSplit.join('/') + '/';  // eslint-disable-line


// global values
window.g_MODAL_WIDTH = 800;
