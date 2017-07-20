'use strict';
const utils = require('../../utils/all');

module.exports = [
  // {
  //   type: 'input',
  //   name: 'appName',
  //   message: 'Please choose your application name',
  //   default: utils.yeoman.getAppName()
  // },
  {
    type: 'list',
    name: 'pageTemplate',
    message: 'Which template do you want to use?',
    choices: utils.config.getChoices('pageTemplate'),
    default: utils.config.getDefaultChoice('pageTemplate')
  }
  // {
  //   type: 'confirm',
  //   name: 'cssmodules',
  //   message: 'Enable css module support? See https://github.com/gajus/react-css-modules for further info',
  //   default: true
  // },
  // {
  //   type: 'confirm',
  //   name: 'postcss',
  //   message: 'Enable postcss?',
  //   default: false
  // }
];
