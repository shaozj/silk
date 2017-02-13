/**
 * 数据请求管理
 * 采用 fetch api 请求数据
 */

class RequestManager {
  /**
   * get 请求例子
   */
  static fetchGet(data) {
    let u = setUrlSearchParams(data);
    return fetchW('/video/v5video/item/search.htm?' + u, {
      credentials: 'include'
    });
  }

  /**
   * post 请求例子
   */
  static fetchPost(data) {
    return fetchW('/video/v5video/item/add.htm', {
      method: 'POST',
      body: setUrlSearchParams(data),
      credentials: 'include'
    });
  }

}

/**
 * 对 fetch 过程的通用包装
 */
function fetchW(req, opt) {
  return fetch(req, opt)
  .then(checkStatus)
  .catch(err => {
    console.error('fetch failed', err)
  })
  .then(parseJSON)
  .then(data => {
    console.log('fetch succeeded with JSON response, ', data);
    return data;
  });
}

/**
 * change data to URLSearchParams
 */
function setUrlSearchParams(data) {
  let urlSearchParams = new URLSearchParams();
  for (let name in data) {
    urlSearchParams.append(name, data[name]);
  }
  return urlSearchParams;
}

/**
 * change data to formData
 */
function setFormData(data) {
  let formData = new FormData();
  for (let name in data) {
    formData.append(name, data[name]);
  }
  return formData;
}

/**
 * Promise 超时处理, 可用于处理 fetch 请求超时
 */
function setPromiseTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('request timeout');
    }, ms);
    promise.then(resolve, reject);
  });
}

/**
 * fetch 不会 reject http 请求的错误状态（error status 比如 404 或 500）
 * 可以自己对 response 做处理
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

/**
 * 从 response 中解析出 json
 */
function parseJSON(response) {
  return response.json()
}

export default RequestManager;

