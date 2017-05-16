'use strict';

const IMG_HOST = (window.GV && window.GV.IMG_HOST) || 'http://ykimg.alicdn.com/develop/';

class ImgUtils {
  static getFullUrl(url) {
    if (!url) {
      return '';
    }
    if (url.indexOf('http') < 0) {
      return IMG_HOST + url;
    }
    return url;
  }

  static removeImgHost(url) {
    if (!url) {
      return '';
    }
    if (url.indexOf('http') > -1) {
      return url.split(IMG_HOST)[1];
    }
    return url;
  }
}

export default ImgUtils;
