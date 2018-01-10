// 浏览器事件封装，支持一次监听多个事件

export function on(el, eventName, cb, opts) {
  opts = opts || false;
  const eventNameArr = eventName.split(/\s+/);

  if (el.addEventListener) {
    eventNameArr.map(name => {
      if (name) {
        el.addEventListener(name, cb, opts);
      }
    });
  } else if (el.attachEvent) {
    eventNameArr.map(name => {
      if (name) {
        el.attachEvent(`on${name}`, e => {
          cb.call(el, e || window.event);
        });
      }
    });
  }
}

export function off(el, eventName, cb, opts) {
  opts = opts || false;
  const eventNameArr = eventName.split(/\s+/);

  if (el.removeEventListener) {
    eventNameArr.map(name => {
      if (name) {
        el.removeEventListener(name, cb, opts);
      }
    });
  } else if (el.detachEvent) {
    eventNameArr.map(name => {
      if (name) {
        el.detachEvent(`on${name}`, cb);
      }
    });
  }
}
