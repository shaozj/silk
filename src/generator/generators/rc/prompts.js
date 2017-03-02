'use strict';
const utils = require('../../utils/all');

module.exports = [
  {
    type: 'list',
    name: 'type',
    message: '您想生成哪种类型的组件?',
    choices: utils.config.getChoices('rcType'),
    default: utils.config.getDefaultChoice('rcType')
  }
];
