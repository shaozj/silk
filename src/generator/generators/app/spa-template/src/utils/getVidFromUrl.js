// 从 url 中解析出优酷视频 vid

export default function getVidFromUrl(url) {
  let vid = '';
  const match = url.match(/id_([a-zA-Z0-9=]+)/);
  if (match) {
    vid = match[1];
  }
  return vid;
}
