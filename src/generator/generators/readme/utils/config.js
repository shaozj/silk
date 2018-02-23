'use strict';
let opts = require('./configopts.json');

/**
 * Get a setting
 * @param  {String} setting
 * @return {Mixed} setting or null if not found
 * settings as `style`, `cssmodules`,`postcss`,`path`
 */
let getSetting = (setting) => {
  return opts[setting] !== undefined ? opts[setting] : null;
}

/**
 * 根据特定的key获取所有的配置list
 */
let getChoices = function getChoices(setting) {
  let config = getSetting(setting);
  return config && Array.isArray(config.options) ? config.options : null;
}

/**
 * Get the wanted choice by key
 * @param  {String} setting
 * @param  {String} key
 * @return {Object}
 * configUtils.getChoiceByKey('path', type).path;
 */
let getChoiceByKey = (setting, key) => {
  let choices = getChoices(setting);
  //Get option part
  if(!choices) {
    return null;
  }
  let result = null;
  //depend on key to get special configuration
  for(let choice of choices) {
    if(choice.name === key) {
      result = choice;
      break;
    }
  }
  return result;
}

/**
 * Get the default choice for a config setting
 * @param  {String} setting
 * @return {Mixed}
 * Get default configuration by setting!
 */
let getDefaultChoice = (setting) => {
  let config = getSetting(setting);
  return config && config.default !== undefined && config.default.length > 0 ? config.default : null;
}

module.exports = {
  getSetting,
  //Settings consist of `style`, `cssmodules`,`postcss`,`path`
  getChoices,
  //Get options
  getChoiceByKey,
  getDefaultChoice
};
