import path from 'path';
import webpack from 'webpack';

export default function (args, config, paths) {
  let dllEntry = ['react', 'react-dom', 'antd', 'whatwg-fetch'];
  if (config.dllEntry && config.dllEntry.length && config.dllEntry.length > 0) {
    dllEntry = config.dllEntry;
  }
  return {
    entry: {
      vendor: dllEntry
    },
    output: {
      path: paths.appPublic,
      filename: '[name].dll.js',
      /**
       * output.library
       * 将会定义为 window.${output.library}
       * 在这次的例子中，将会定义为`window.vendor_library`
       */
      library: '[name]_library'
    },
    plugins: [
      new webpack.DllPlugin({
        /**
         * path
         * 定义 manifest 文件生成的位置
         * [name]的部分由entry的名字替换
         */
        path: path.join(paths.appPublic, '[name]-manifest.json'),
        /**
         * name
         * dll bundle 输出到那个全局变量上
         * 和 output.library 一样即可
         */
        name: '[name]_library'
      })
    ]
  };
};
