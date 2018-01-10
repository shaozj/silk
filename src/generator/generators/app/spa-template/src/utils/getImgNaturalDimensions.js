// 获取图片原始尺寸

export default function getImgNaturalDimensions(img, callback) {
  if (img.naturalWidth) { // 现代浏览器
    callback(img.naturalWidth, img.naturalHeight);
  } else { // IE6/7/8
    let image = new Image();
    image.src = img.src;
    image.onload = () => {
      callback(image.width, image.height);
    };
  }
}
