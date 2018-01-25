const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const cwd = process.cwd();
const request = require('request');
const unzip = require('unzip');

module.exports = function download (url, name, cb) {
  if (!name) {
    console.log(chalk.red('请输入页面名称'));
    return;
  }

  request(url)
    .on('error', function (error) {
      console.log(chalk.red('下载失败', error));
    })
    .on('response', function () {
      console.log(chalk.yellow('下载成功, 正在解压...'));
    })
    .on('end', function () {
      fs.createReadStream(`./${name}.zip`)
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
          let fileName = entry.path;
          let type = entry.type; // 'Directory' or 'File' 

          let fileNameArr = fileName.split('/');
          if (fileNameArr.length >= 1) {
            fileNameArr.shift(1);
            fileName = fileNameArr.join('/');
          }
          // 默认获取src/pages/index的模板
          if (!/(^build|^.cache)/.test(fileName) && fileName) {
            console.log('fileName: ', fileName)
            if (type == 'Directory') {
              fs.ensureDirSync(`./${fileName}`);
            } else {
              entry.pipe(fs.createWriteStream(`./${fileName}`));
            }
          } else {
            entry.autodrain();
          }
        });
      setTimeout(function () {
        console.log(chalk.green(`下载模板成功, 文件目录: ${cwd}`));
        fs.removeSync(`${name}.zip`);
        process.exit(0);
      }, 1000);
    })
    .pipe(fs.createWriteStream(`${name}.zip`))
    .on('finish', cb);
}
