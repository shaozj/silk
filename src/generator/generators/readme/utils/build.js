const webpack = require("@ali/webpackcc/lib/build");
const reactDocs = require("react-docgen");
const path = require("path");
const fs = require("fs");
const transform = require("./transformer");
const transformHOC = require("./transform_hoc");
const async = require("async");
const ROOT = process.cwd();
const generator = require("babel-generator").default;
const BASIC_PATH_PREFIX = path.join(ROOT, "./src");
// 组件的位置
const components = "./src/components";
const DEFAULT_WEBPACK_MODULES_PATH = path.join(ROOT, "./node_modules");
const indexTestJS = path.join(process.cwd(), "./src/index.test.js");
const EXPORTS_FILE_PATH = path.join(process.cwd(), "./src/index.js");
const DEFAULT_FOLDER_PATH = path.join(process.cwd(), "./src");
const indexTransformer = require("./transform_index");

// "./node_modules"
const program = {
  cwd: ROOT,
  dev: true
};

/**
 * 得到完整的文件路径
 */
function getFullPath(array) {
  const fullPath = [];
  for (let i = 0, len = array.length; i < len; i++) {
    if (/^(\.|components)\S*/.test(array[i])) {
      if (/^\.\S*/) {
        // 相对地址,是相对index.test.js的，即src目录
        fullPath.push(path.join(BASIC_PATH_PREFIX, array[i]));
      } else {
        //components这种
        fullPath.push(path.join(components, array[i]));
      }
    } else {
      fullPath.push(array[i]);
    }
  }
  return fullPath;
}

/**
 * 打包具体的文件"./src/test.js"
 * nodejs中fs.readFile这些方法返回的对象都是什么?
 * [{"source":"./lib/AutoSeekCtr/index.js","name":"AutoSeekCtr"},{"source":"./lib/MaterialUps/index.js","name":"MaterialUps"},{"source":"./lib/VideoPreview/index.js","name":"VideoPreview"},{"source":"./lib/YouKuH5Player/index.js","name":"KuVideo"}]
 * 导出的对象为====["AutoSeekCtr","MaterialUps","VideoPreview","KuVideo"]

 */
function packJsBundle(jsFile, callback) {
  fs.readFile(jsFile, "utf8", (err, data) => {
    const id0imports = transform(data);
    // console.log('组件名称为==='+id0imports.componentName);
    const componentName = id0imports.componentName;
    const relativeExports = id0imports.relativeExports;
    let fullPath = getFullPath(id0imports.imports);

    const antdImports = id0imports.antdExports;
    const inputAst = id0imports.inputAst;
    const sourceCode = generator(inputAst, null, data).code;
    //   已经知道每一个文件的完整路径，我们需要构建webpack.config.js来完成构建打包到window上，借助async来顺序完成
    const rules = [],
      outputFiles = [],
      entry = {
        main: require.resolve(indexTestJS)
      };
    for (let i = 0, len = fullPath.length; i < len; i++) {
      const specifier = id0imports.specifiers[i];
      const localCaseSpecifier = specifier.toLowerCase();
      // 1.entry中不需要react-dom和react,否则会单独产生react-dom和react挂载到window上
      // 2.react,react-dom也没有expose出去，这样打包index.test.js的时候react,react-dom会单独打包进去,不会依赖于外部react,react-dom
      if (localCaseSpecifier == "react" || localCaseSpecifier == "reactdom") {
        continue;
      }
      entry[`${specifier}`] = fullPath[i];

      outputFiles.push(specifier);

      const TEST = /^\//.test(fullPath[i])
        ? require.resolve(fullPath[i])
        : require.resolve(fullPath[i], {
            paths: [DEFAULT_WEBPACK_MODULES_PATH]
          });
      rules.push({
        test: TEST,
        // 这里的require.resolve会是相对于silk来说的，所以找不到jquery这个库
        use: [
          {
            loader: require.resolve("expose-loader"),
            options: specifier
          }
        ]
      });
    }

    for (let i = 0, len = relativeExports.length; i < len; i++) {
      const { key, imports, source } = relativeExports[i];
      // "./2exports.js";直接挂载到window的一个随机数上~~~~
      rules.push({
        test: require.resolve(path.join(BASIC_PATH_PREFIX, source)),
        use: [
          {
            loader: require.resolve("expose-loader"),
            options: key
          }
        ]
      });
    }

    fs.readFile(path.join(process.cwd(), "./.silkrc"), (err, data) => {
      if (err) {
        console.log(".silkrc读取异常，进程将退出.....");
        process.exit(0);
      }
      let useBabelrc = false;
      let disableCSSModules = false;
      let silkrcJSON = {};
      try {
        silkrcJSON = JSON.parse(data);
      } catch (error) {
        console.log(".silkrc解析为JSON失败，程序退出...");
        process.exit(0);
      }
      try {
        disableCSSModules = JSON.parse(data).disableCSSModules;
      } catch (error) {
        console.log(".silkrc文件不符合JSON...disableCSSModules默认设置为false");
      }
      try {
        useBabelrc = JSON.parse(data).useBabelrc;
      } catch (error) {
        console.log(".silkrc文件不符合JSON...useBabelrc默认设置为false");
      }
      const webpackConfig = {
        entry,
        disableCSSModules: disableCSSModules,
        useBabelrc: useBabelrc,
        // 是否使用userBabelrc文件
        resolve: {
          modules: [DEFAULT_WEBPACK_MODULES_PATH, "node_modules"]
        },
        output: {
          path: path.join(ROOT, "./build")
        },
        node: {
          child_process: "empty",
          cluster: "empty",
          dgram: "empty",
          dns: "empty",
          fs: "empty",
          module: "empty",
          net: "empty",
          readline: "empty",
          repl: "empty",
          tls: "empty",
          "aws-sdk": "empty",
          console: false,
          url: false
        },
        resolve: {
          extensions: [
            ".web.js",
            ".web.jsx",
            ".web.ts",
            ".web.tsx",
            ".js",
            ".json",
            ".jsx",
            ".ts",
            "tsx"
          ],
          alias: {
            components: `${BASIC_PATH_PREFIX}/components/`,
            containers: `${BASIC_PATH_PREFIX}/containers/`,
            utils: `${BASIC_PATH_PREFIX}/utils/`,
            mods: `${BASIC_PATH_PREFIX}/mods/`,
            images: `${BASIC_PATH_PREFIX}/images/`,
            "react/lib/ReactMount": "react-dom/lib/ReactMount"
          }
        },
        module: {
          rules
        }
      };
      // extraBabelPlugins和extraBabelPresets只有在useBabelrc为false的情况下使用
      if (!silkrcJSON.useBabelrc) {
        webpackConfig.extraBabelPlugins = silkrcJSON.extraBabelPlugins;
        webpackConfig.extraBabelPresets = silkrcJSON.extraBabelPresets;
      }
      program.config = webpackConfig;

      // console.log("webpack打包的配置为:" + JSON.stringify(webpackConfig));
      // 下面是准备对index.test.js中的所有模块进行打包，打包之前，我先解析index.js，得到打包后应该生成的table内容
      // 开始解析index.js，此处可以使用async,await
      fs.readFile(EXPORTS_FILE_PATH, "utf8", (err, data) => {
        if (err) {
          console.log("文件下不存在index.js，程序将会退出...");
          process.exit(0);
        }
        const { imports, exportNames } = indexTransformer(data);

        // exportNames表示导出的对象名称
        const indexExposeModules = imports.map((item, index) => {
          return path.join(DEFAULT_FOLDER_PATH, item.source);
        });

        const functionPools = [],
          componentInfoArray = [];
        // 产生函数数组

        for (let i = 0, len = indexExposeModules.length; i < len; i++) {
          const localFunc = function(callback) {
            return fs.readFile(indexExposeModules[i], "utf8", (err, data) => {
              if (err) {
                console.log(`读取文件${indexExposeModules[i]}失败!`);
              }
              callback(null, data);
            });
          };
          functionPools.push(localFunc);
        }
        // 得到所有的index.js中exports的组件的文档信息,然后开始开始打包index.test.js将所有的exports组件信息导出用于生成文档
        async.parallel(functionPools, (err, results) => {
          if (err) {
            console.log(`并发读取文件失败,程序将会退出!`);
          }
          // 这里是result类型
          for (let t = 0, len = results.length; t < len; t++) {
            const ast = transformHOC(results[t]).inputAst;
            const sourceCode = generator(ast, null, results[t]).code;
            const documentation = reactDocs.parse(sourceCode);
            // console.log('documentation===='+JSON.stringify(documentation));
            componentInfoArray.push({
              specifier: exportNames[t],
              documentation
            });
          }
          webpack(program, (err, stats) => {
            if (!err) {
              console.log("打包demo资源成功.....");
              // 回调:打包输出文件+div#id+源码+specifiers
              callback(
                outputFiles,
                id0imports.id,
                sourceCode,
                id0imports.specifiers,
                antdImports,
                relativeExports,
                componentName,
                componentInfoArray
              );
            }
          });
        });
        // 准备生成表格内容
      });
    });
  });
}

module.exports = packJsBundle;
