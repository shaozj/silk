'use strict';
const Generators = require('yeoman-generator');
const utils = require('../../utils/all');
const prompts = require('./prompts');
const path = require('path');
const fs = require('fs');

const baseRootPath = path.join(__dirname, 'templates');

/**
 * will copy react page template to your application
 */
class AppGenerator extends Generators.Base {

  constructor(args, options) {
    super(args, options);

    this.argument('name', { type: String, required: true });
  }

  initializing() {

  }

  prompting() {
    return this.prompt(prompts).then((answers) => {
      // Set needed global vars for yo
      this.pageTemplate = answers.pageTemplate;
    });
  }

  configuring() {
    // Use our plain template as source
    const templatePath = path.join(baseRootPath, this.pageTemplate);
    this.sourceRoot(templatePath);
    this.myTemplatePath = templatePath;
    console.log('baseRootPath: ' + baseRootPath);
    // Change our package.json. Make sure to also include the required dependencies for template page
    let defaultSettings = this.fs.readJSON(`${process.cwd()}/package.json`);
    let packageSettings = defaultSettings;
    packageSettings.dependencies = packageSettings.dependencies;

    // Add dependencies if we need
    let pageTemplateConfig = utils.config.getChoiceByKey('pageTemplate', this.pageTemplate);
    if(pageTemplateConfig && pageTemplateConfig.packages) {
      for(let dependency of pageTemplateConfig.packages) {
        packageSettings.dependencies[dependency.name] = dependency.version;
      }
    }

    this.fs.writeJSON(this.destinationPath('package.json'), packageSettings);
  }

  writing() {

    const excludeList = [
      'node_modules',
      '.istanbul.yml',
      '.travis.yml'
    ];

    // Get all files in our repo and copy the ones we should
    fs.readdir(this.sourceRoot(), (err, items) => {

      for(let item of items) {

        // Skip the item if it is in our exclude list
        if(excludeList.indexOf(item) !== -1) {
          continue;
        }

        // Copy all items to our root
        let fullPath = path.join(this.myTemplatePath, item);
        if(fs.lstatSync(fullPath).isDirectory()) {
          this.bulkDirectory(item, path.join('src/pages', this.name, item));
        } else {
          this.copy(item, path.join('src/pages', this.name, item));
        }
      }
    });
  }

  install() {

    // if(!this.options['skip-install']) {
    //   this.installDependencies({ bower: false });
    // }

  }
}

module.exports = AppGenerator;
