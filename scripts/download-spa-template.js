const download = require('./download');
const program = require('commander');
const colors = require('colors');
const inquirer = require('inquirer');

program
  .version('0.0.1')
  .option('get', '获取模板')
  .command('get [pageName]', '请输入新建页面名称')
  .parse(process.argv);

if (program.get) {
  console.log(process.argv.slice(3))
  download(process.argv);
}
