/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const args = require('minimist')(process.argv.slice(2));

/**
 * Flag indicating whether webpack compiled for the first time.
 * @type {boolean}
 */
let isInitialCompilation = true;

/**
 * 两种热加载模式，刷新页面和刷新模块
 * hot reload mode,
 * hr: hot refresh page,
 * hrm: hot module refresh
 */
let mode = args.mode;
let port = config.port;
// 每个 entry 注入热加载所需文件
for (let i in config.entry) {
  config.entry[i].unshift(
    'webpack-dev-server/client?http://127.0.0.1:' + port,
    'webpack/hot/only-dev-server'
  );
}

config.devServer = {
  contentBase: 'build/', // webpack-dev-server 伺服的文件目录
  historyApiFallback: true,
  port: port,
  publicPath: config.output.publicPath,
  stats: { colors: true },
  noInfo: false,
  proxy: [
    {
      context: ['/common/**', '/tair/**', '/video/**'],
      target: 'http://mytv-test.alibaba.net',
      //pathRewrite: {'^/api' : '/'},
      //changeOrigin: true,
      secure: false
    },
    {
      context: ['/topic/**'],
      target: 'http://localhost:8080/',
      secure: false
    }
  ]
};

if (mode != 'hr') {
  config.devServer.hot = true;
}

const compiler = webpack(config);

new WebpackDevServer(compiler, config.devServer)
.listen(config.port, '127.0.0.1', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config.port);
});

compiler.plugin('done', () => {
  if (isInitialCompilation) {
    // Ensures that we log after webpack printed its stats (is there a better way?)
    setTimeout(() => {
      console.log('\n✓ The bundle is now ready for serving!\n');
      console.log('  Open in iframe mode:\t\x1b[33m%s\x1b[0m',  'http://localhost:' + config.port + '/webpack-dev-server' + config.devServer.publicPath + '\n');
      console.log('  Open in inline mode:\t\x1b[33m%s\x1b[0m', 'http://localhost:' + config.port + config.devServer.publicPath + '\n');
      console.log('  \x1b[33mHMR is active\x1b[0m. The bundle will automatically rebuild and live-update on changes.')
    }, 350);
  }
  isInitialCompilation = false;
});
