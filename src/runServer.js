import fs from 'fs';
import spawn from 'cross-spawn';
import detect from 'detect-port';
import clearConsole from 'react-dev-utils/clearConsole';
import getProcessForPort from 'react-dev-utils/getProcessForPort';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import openBrowser from 'react-dev-utils/openBrowser';
import prompt from 'react-dev-utils/prompt';
import webpack from 'webpack';
import historyApiFallback from 'connect-history-api-fallback';
import WebpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';
import chokidar from 'chokidar';
import getPaths from './utils/paths';
import getConfig from './utils/getConfig';
import applyWebpackConfig, { warnIfExists } from './utils/applyWebpackConfig';
import { applyMock, outputError as outputMockError } from './utils/mock';
import glob from 'glob';

process.env.NODE_ENV = 'development';

let DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
const isInteractive = process.stdout.isTTY;
const cwd = process.cwd();
const paths = getPaths(cwd);
let compiler;

const argv = require('yargs')
  .usage('Usage: roadhog server [options]')
  .option('open', {
    type: 'boolean',
    describe: 'Open url in browser after started',
    default: true,
  })
  .help('h')
  .argv;

let rcConfig;
let config;
let entries; // 页面入口，当页面入口发生变化时（新建页面时），重启服务器
let startTime, endTime; // 计算编译时间

function clearConsoleWrapped() {
  if (process.env.CLEAR_CONSOLE !== 'NONE') {
    clearConsole();
  }
}

function readRcConfig() {
  try {
    rcConfig = getConfig(process.env.NODE_ENV, cwd);
  } catch (e) {
    console.log(chalk.red('Failed to parse .silkrc config.'));
    console.log();
    console.log(e.message);
    process.exit(1);
  }
}

function readWebpackConfig() {
  config = applyWebpackConfig(
    require('./config/webpack.config.dev')(rcConfig, cwd),
    process.env.NODE_ENV,
  );
}


function setupCompiler(host, port, protocol) {
  compiler = webpack(config);

  compiler.plugin('invalid', () => {
    if (isInteractive) {
      clearConsoleWrapped();
    }
    console.log('Compiling...');
    startTime = (new Date()).getTime();
  });

  let isFirstCompile = true;
  compiler.plugin('done', (stats) => {
    if (isInteractive) {
      clearConsoleWrapped();
    }

    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    const showInstructions = isSuccessful && (isInteractive || isFirstCompile);

    warnIfExists();

    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'));
      // show compile time
      console.log(chalk.yellow('Compile time: ' + ((new Date()).getTime() - startTime) / 1000 + 's'));
    }

    if (showInstructions) {
      console.log();
      console.log('The app is running at:');
      console.log();
      console.log(`  ${chalk.cyan(`${protocol}://${host}:${port}/`)}`);
      console.log();
      console.log('Note that the development build is not optimized.');
      console.log(`To create a production build, use ${chalk.cyan('npm run build')}.`);
      console.log();
      isFirstCompile = false;
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'));
      console.log();
      messages.errors.forEach((message) => {
        console.log(message);
        console.log();
      });

    // Show warnings if no errors were found.
    } else if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log();
      messages.warnings.forEach((message) => {
        console.log(message);
        console.log();
      });
      // Teach some ESLint tricks.
      console.log('You may use special comments to disable some warnings.');
      console.log(`Use ${chalk.yellow('// eslint-disable-next-line')} to ignore the next line.`);
      console.log(`Use ${chalk.yellow('/* eslint-disable */')} to ignore all warnings in a file.`);
      console.log();
    }

    if (isInteractive) {
      outputMockError();
    }
  });
}

function addMiddleware(devServer) {
  const proxy = require(paths.appPackageJson).proxy;
  devServer.use(historyApiFallback({
    disableDotRule: true,
    htmlAcceptHeaders: proxy ?
      ['text/html'] :
      ['text/html', '*/*'],
  }));
  // TODO: proxy index.html, ...
  devServer.use(devServer.middleware);
}

function runDevServer(host, port, protocol) {
  const devServer = new WebpackDevServer(compiler, {
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    https: protocol === 'https',
    host,
    proxy: rcConfig.proxy,
  });

  addMiddleware(devServer);
  applyMock(devServer);

  devServer.listen(port, (err) => {
    if (err) {
      return console.log(err);
    }

    process.send('READY');

    if (isInteractive) {
      clearConsoleWrapped();
    }
    console.log(chalk.cyan('Starting the development server...'));
    console.log();
    if (isInteractive) {
      outputMockError();
    }

    if (argv.open) {
      openBrowser(`${protocol}://${host}:${port}/`);
    }
  });

  setupWatch(devServer, port);
}

function setupWatch(devServer) {
  const files = [
    paths.resolveApp('.silkrc'),
    paths.resolveApp('.silkrc.js'),
    paths.resolveApp('webpack.config.js'),
  ]
    .concat(typeof rcConfig.theme === 'string' ? paths.resolveApp(rcConfig.theme) : []);
  const watcher = chokidar.watch(files, {
    ignored: /node_modules/,
    persistent: true,
  });
  watcher.on('change', (path) => {
    console.log(chalk.green(`File ${path.replace(paths.appDirectory, '.')} changed, try to restart server`));
    watcher.close();
    devServer.close();
    process.send('RESTART');
  });

  /**
   * 监听是否有新建页面，（是否有新的页面入口）
   * 如果有新建页面，则重启服务器
   */
  let globPath = rcConfig.entry ? paths.appDirectory+'/'+rcConfig.entry  : `${paths.appSrc}/pages/*/index.js`;
  entries = glob.sync(globPath);
  
  const pageDir = paths.resolveApp('./src/pages/');
  chokidar.watch(pageDir).on('add',
    (path) => {
      let curEntries = glob.sync(globPath);
      let diff = false;
      let len = curEntries.length;
      if (len != entries.length) {
        diff = true;
      } else {
        for (let i = 0; i < len; i++) {
          if (curEntries[i] != entries[i]) {
            diff = true;
            break;
          }
        }
      }
      if (diff) {
        console.log(chalk.green(`Added ${path.replace(paths.appDirectory, '.')} , try to restart server`));
        watcher.close();
        devServer.close();
        process.send('RESTART');
        entries = curEntries;
      }
  });
}

function run(port) {
  startTime = (new Date()).getTime();
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  const host = process.env.HOST || 'localhost';
  setupCompiler(host, port, protocol);
  runDevServer(host, port, protocol);
}

function init() {
  readRcConfig();
  // 如果配置了dll功能，首先看是否存在了 vendor.dll.js 文件，如果不存在，则需要先运行 silk dll
  if (rcConfig.dll) {
    if (!fs.existsSync(`${paths.appPublic}/vendor.dll.js`)) {
      console.log(' ️⚠️  ️You are using webpack dll. ');
      console.log('Please run ' + chalk.yellow('silk dll') + ' first');
      console.log('and add code ' + chalk.green('<script src="/vendor.dll.js"></script>') + 
        ' to your template-dev.html ');
      return;
    }
  }
  readWebpackConfig();
  
  // 命令行设置端口优先级最高，用户配置优先级次之，默认端口8000
  DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : rcConfig.port;
  detect(DEFAULT_PORT).then((port) => {
    // 当前端口未被占用
    if (port == DEFAULT_PORT) {
      run(port);
      return;
    }
    // 当前端口被占用时，分配一个新的端口 port
    if (isInteractive) {
      clearConsoleWrapped();
      const existingProcess = getProcessForPort(DEFAULT_PORT);
      const question =
        chalk.yellow(`Something is already running on port ${DEFAULT_PORT}.${((existingProcess) ? ` Probably:\n  ${existingProcess}` : '')}\n\nWould you like to run the app on another port instead?`);

      prompt(question, true).then((shouldChangePort) => {
        if (shouldChangePort) {
          run(port);
        }
      });
    } else {
      console.log(chalk.red(`Something is already running on port ${DEFAULT_PORT}.`));
    }
  });
}

init();
