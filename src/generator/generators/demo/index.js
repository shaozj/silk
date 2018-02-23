// import Generators from "yeoman-generator";
const Generators = require("yeoman-generator");
const fs = require("fs");
const async = require("async");
const utils = require("./utils/all");
// 工具函数
const prompts = require("./prompts");
// 默认要填写的内容
const path = require("path");
const bulkMoveFiles = require("./utils/fileUtil");
const glob = require("glob");
const mkdirp = require("mkdirp");
// 批量移动文件的方法
const cwd = process.cwd();
// 源文件的路径
class AppGenerator extends Generators.Base {
  constructor(args, options) {
    super(args, options);
    this.option("skip-welcome-message", {
      desc: "Skip the welcome message",
      type: Boolean,
      defaults: false
    });
    this.option("skip-install");
    // this.sourceRoot(baseRootPath);
    // 默认的root为"./templates",通过该方法覆盖
    this.config.save();
    //Calling `this.config.save()` from a generator for the first time will create the file(yo-rc.json).
  }

  initializing() {
    if (!this.options["skip-welcome-message"]) {
      this.log(require("yeoman-welcome"));
      this.log(
        "Out of the box I include Webpack and some default React components.\n"
      );
    }
  }

  prompting() {
    this.log("当你运行该命令的时候表示你需要发布你的组件到demo站点中,请知悉......");
    return this.prompt(prompts).then(answers => {
      //如果用户输入的组件名称和默认的不一致，需要设置为默认的组件名称
      this.publish = answers.publish;
      // 为yoeman设置默认的全局变量
      this.appName = answers.appName;
      this.chineseName = answers.chineseName;
      this.desc = answers.desc;
      this.category = answers.category;
      this.frame = answers.frame;
      this.platform = answers.platform;
      this.overallDesc = answers.overallDesc;
      this.when2Use = answers.when2Use;
      this.api = answers.api;
      this.demoTitle = answers.demoTitle;
      this.config.set("appName", this.appName);
      this.config.set("chineseName", this.chineseName);
      this.config.set("desc", this.desc);
      // demo说明
      this.config.set("category", this.category);
      this.config.set("frame", this.frame);
      this.config.set("platform", this.platform);
      this.config.set("overallDesc", this.overallDesc);
      // readme的说明
      this.config.set("api", this.api);
      this.config.set("when2Use", this.when2Use);
      // 这些变量用于子级Generator
      this.config.set("demoTitle", this.demoTitle);
      this.config.set("publish", this.publish);
    });
  }

  configuring() {}

  /**
   * 产生一个demo文件夹，将我们的文件移动到里
   */
  writing() {
    //  需要顶格，否则有多余的空格
    const markdownReadmeTemplate = `---
category: ${this.config.get("category")}
name: ${this.config.get("appName")}
desc: ${this.config.get("chineseName")}
frame:
- ${this.config.get("frame")}
platform:
- ${this.config.get("platform")}
---

${this.config.get("overallDesc")}

## 何时使用

${this.config.get("when2Use")}

## API
${this.config.get("api")}
`;

    // 下面的内容放到demo文件夹下
    const markdownDemoTemplate = `---
title: ${this.config.get("chineseName")}
dependencies:
- https://unpkg.com/react/dist/react.js
---

## ${this.config.get("demoTitle")}

${this.config.get("desc")}

\`\`\`css
<!-- 这里是内联的css -->
\`\`\`

\`\`\`js
//这里是内联的js
\`\`\`

\`\`\`html
<!-- 这里是内联的html -->
<div id="react-content"></div>
\`\`\`
`;

    const demoPath = path.join(cwd, "./demo");

    async.parallel(
      [
        callback => {
          fs.writeFile(
            path.join(cwd, "./readme.md"),
            markdownReadmeTemplate,
            function() {
              callback(null, true);
              console.log("README文件写入完毕!");
            }
          );
        },
        callback => {
          mkdirp(demoPath, err => {
            fs.writeFile(
              demoPath + "/basic.md",
              markdownDemoTemplate,
              function() {
                callback(null, true);
                console.log("使用实例文件写入完毕!");
              }
            );
            // bulkMoveFiles.bind(this)(this.sourceRoot(), this.destinationPath());
          });
        }
      ],
      (err, callback) => {
        if (err) {
          this.log("创建规范站点发布文件失败,程序将退出......");
          process.exit(1);
        } else {
          const needPublish = this.config.get("publish");
          if (!this.config.get("publish")) {
            this.log("规范站点需要的文件已经生成成功，你可以手动为package.json添加std:true要求发布......");
          } else {
            let pkg = {};
            fs.readFile(path.join(cwd, "./package.json"), (err, res) => {
              if (err) {
                this.log("发布该组件失败.....");
                return;
              }
              pkg = JSON.parse(res);
              pkg["std"] = true;
              // 强制发布
              fs.writeFile(
                path.join(cwd, "./package.json"),
                JSON.stringify(pkg, null, 10),
                (err, res) => {
                  if (!err) {
                    this.log("发布该组件成功.....");
                  }
                }
              );
            });
          }
        }
      }
    );
  }

  install() {}

  end() {
    this.log("Generator执行完成，准备退出.....");
    process.exit(0);
  }
}
module.exports = AppGenerator;
