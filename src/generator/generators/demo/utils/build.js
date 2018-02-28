const webpack = require("@ali/webpackcc/lib/build");
// const nativeWebpack = require("webpack");
const path = require("path");
const fs = require("fs");
const transform = require("./transformer");
const async = require("async");
const ROOT = process.cwd();
const generator = require("babel-generator").default;
const BASIC_PATH_PREFIX = path.join(ROOT, "./src");
// 组件的位置
const components = "./src/components";
const DEFAULT_WEBPACK_MODULES_PATH = path.join(ROOT, "./node_modules");
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
 * 产生demo的内容
 */
function packJsBundle(jsFile, callback) {
  fs.readFile(jsFile, "utf8", (err, data) => {
    const id0imports = transform(data);
    let fullPath = getFullPath(id0imports.imports);
    const inputAst = id0imports.inputAst;
    const sourceCode = generator(inputAst, null, data).code;
    //   已经知道每一个文件的完整路径，我们需要构建webpack.config.js来完成构建打包到window上，借助async来顺序完成
    const rules = [],
      outputFiles = [],
      entry = {};
    for (let i = 0, len = fullPath.length; i < len; i++) {
      const specifier = id0imports.specifiers[i];
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

    const webpackConfig = {
      entry,
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
    program.config = webpackConfig;
    console.log("webpack打包的配置为:" + JSON.stringify(webpackConfig));

    webpack(program, (err, stats) => {
      if (!err) {
        console.log("打包demo资源成功.....");
        // 回调:打包输出文件+div#id+源码+specifiers
        callback(outputFiles, id0imports.id, sourceCode, id0imports.specifiers);
      }
    });
  });
}

module.exports = packJsBundle;
