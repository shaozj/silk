'use strict';
const Generators = require('yeoman-generator');
const utils = require('../../utils/all');
const prompts = require('./prompts');
const path = require('path');
const fs = require('fs');
const packageInfo = require('../../package.json');
const download = require('../../../../scripts/download');

const baseRootPath = path.join(__dirname, 'react-webpack-multipage-template');
const spaRootPath = path.join(__dirname, 'spa-template');

/**
 * Base generator.
 */
class AppGenerator extends Generators.Base {
  constructor(args, options) {
    super(args, options);

    // Make options available, default close welcome message
    this.option('skip-welcome-message', {
      desc: 'Skip the welcome message',
      type: Boolean,
      defaults: true
    });
    this.option('skip-install', {
      defaults: true
    });

    // 是否从 gitlab 拉取最新 spa-template 代码
    this.remote = options && options.remote;

    // Use our plain template as source
    this.sourceRoot(baseRootPath);

    this.config.save();
  }

  initializing() {
    if(!this.options['skip-welcome-message']) {
      this.log(require('yeoman-welcome'));
    }
  }

  prompting() {
    return this.prompt(prompts).then((answers) => {

      // Make sure to get the correct app name if it is not the default
      if(answers.appName !== utils.yeoman.getAppName()) {
        answers.appName = utils.yeoman.getAppName(answers.appName);
      }

      // Set needed global vars for yo
      this.appType = answers.appType;
      this.appName = answers.appName;
      this.style = answers.style;
      this.cssmodules = answers.cssmodules || true;
      this.postcss = answers.postcss || true;
      this.generatedWithVersion = parseInt(packageInfo.version.split('.').shift(), 10);

      // Set needed keys into config
      this.config.set('appType', this.appType);
      this.config.set('appName', this.appName);
      this.config.set('appPath', this.appPath);
      this.config.set('style', this.style);
      this.config.set('cssmodules', this.cssmodules);
      this.config.set('postcss', this.postcss);
      this.config.set('generatedWithVersion', this.generatedWithVersion);
    });
  }

  configuring() {
    if (this.appType === 'spa') {
      this.sourceRoot(spaRootPath);
    }
    // Generate our package.json. Make sure to also include the required dependencies for styles
    let defaultSettings = this.fs.readJSON(`${this.sourceRoot()}/package.json`);
    let packageSettings = {
      name: this.appName,
      private: true,
      version: '0.0.1',
      description: `${this.appName} - Generated by silki`,
      main: 'src/index/index.js',
      scripts: defaultSettings.scripts,
      repository: '',
      keywords: [],
      author: 'Your name here',
      devDependencies: defaultSettings.devDependencies,
      dependencies: defaultSettings.dependencies
    };

    this.fs.writeJSON(this.destinationPath('package.json'), packageSettings);
  }

  writing() {
    const excludeList = [
      'LICENSE',
      'CHANGELOG.md',
      'node_modules',
      'package.json',
      '.istanbul.yml',
      '.travis.yml'
    ];
    let sourceRoot = this.sourceRoot();

    if (this.appType === 'spa' && this.remote) {
      // 直接拉取 gitlab 上的模板代码
      const url = 'http://gitlab.alibaba-inc.com/tvadmin/spa-template/repository/archive.zip?ref=master';
      download(url, 'cache', () => {});
      return;
    }

    // Get all files in our repo and copy the ones we should
    fs.readdir(sourceRoot, (err, items) => {
      for(let item of items) {

        // Skip the item if it is in our exclude list
        if(excludeList.indexOf(item) !== -1) {
          continue;
        }

        // Copy all items to our root
        let fullPath = path.join(sourceRoot, item);
        if(fs.lstatSync(fullPath).isDirectory()) {
          this.bulkDirectory(item, item);
        } else {
          if (item === '.npmignore') {
            this.copy(item, '.gitignore');
          } else if (item === 'README.md') {
            this.fs.copyTpl(
              this.templatePath(`${sourceRoot}/README.md`),
              this.destinationPath('README.md'),
              this
            )
          } else {
            this.copy(item, item);
          }
        }
      }
    });
  }

  install() {
    // default skip install
    // if(!this.options['skip-install']) {
    //   this.installDependencies({ bower: false });
    // }
  }
}

module.exports = AppGenerator;
