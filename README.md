# silk

## 介绍

react app 开发cli工具，包括脚手架以及开发调试功能，支持开发 react 多页面 app。 
  
支持多种css预处理语言，包括 less sass/scss stylus.

[View README in English](https://github.com/shaozj/silk/blob/master/README_en-us.md)
[view on github](https://github.com/shaozj/silk)

## 下载安装

```bash
$ sudo npm install silki -g
```

## 使用

> 新建一个 react 多页面应用

```bash
$ silk new
```

> 新建一个页面

```bash
$ silk page <name>
```

> 新建一个组件

```bash
$ silk cpnt <name>
```

> 编译代码（在内存中），并启动调试服务器

```bash
$ silk server
```

> 将代码编译并存储在文件中, 默认在 ./build 目录下

```bash
$ silk build
```

> 生成 vendor.dll.js 文件

```
$ silk dll
```

> 显示帮助文档

```bash
$ silk -h
```

> 显示版本

```bash
$ silk --version
```

## 配置

* 配置文件为 **.silkrc** ，在项目的根目录下
* JSON 格式，支持注释

默认配置如下:

```JSON
{
  "entry": "src/pages/**/index.js",
  "disableCSSModules": false,
  "publicPath": "/",
  "outputPath": "./build",
  "extraBabelPlugins": [],
  "extraPostCSSPlugins": [],
  "autoprefixer": null,
  "proxy": null,
  "externals": null,
  "multipage": true,
  "define": null,
  "env": null,
  "theme": null,
  "port": 8000
}
```

### entry

`entry` 是一个页面的入口点。`entry` 选项对应了 webpack 配置文件中的 `entry`。参见[webpack entry](https://webpack.js.org/concepts/#entry)。 不同之处是，.silkrc 中，支持 glob 格式的 ｀entry｀。
  
一个例子如下所示:

**.silkrc**

```
{
  "entry": "src/pages/**/index.js",
}
```

### disableCSSModules

禁用 css modules, 默认为 false. 参见 [css modules](https://github.com/css-modules/css-modules)

### publicPath

设置生产环境下的 publicPath, 开发环境下默认为 '/' . 参见 [webpack output.publicPath](http://webpack.github.io/docs/configuration.html#output-publicpath)

### outputPath

设置 output 路径. 参见 [webpack output.path](http://webpack.github.io/docs/configuration.html#output-path)

### extraBabelPlugins

设置额外的 babel 插件。只支持添加, 不支持替换和删除。
下面是添加 babel-plugin-import 插件的例子:

**.silkrc**

```
{
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "lib", "style": "css" }]
  ]
}
```

### extraPostCSSPlugins

设置额外的 postcss 插件. 目前还未支持.

### autoprefixer

设置 autoprefixer, 参见 [autoprefixer](https://github.com/postcss/autoprefixer) 和 [browserslist](https://github.com/ai/browserslist#queries)

例子:

**.silkrc**

```
{
  "autoprefixer": {
    "browsers": [
      "iOS >= 8", "Android >= 4"
    ]
  }
}
```

### proxy

设置代理, 参见 [webpack dev server proxy](https://webpack.github.io/docs/webpack-dev-server.html#proxy)

例子:

**.silkrc**

```
{
  "proxy": [
      {
        "context": ["/common/**", "/tair/**", "/video/**", "/system/**", "/*.do"],
        "target": "http://mytv-test.alibaba.net",
        "secure": false
      }
    ]
}
```

### externals

设置 webpack externals. 参见 [webpack externals](http://webpack.github.io/docs/configuration.html#externals)

### multipage

是否是多页面应用. 默认为 true.

### define

对应 webpack 中的 DefinePlugin 配置. 值将自动做 JSON.stringify 处理. 参见 [webpack DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin)

Example:

**.silkrc**

```
{
  "define": {
    "PRODUCTION": true,
    "VERSION": "1.0.0",
  }
}
```

### env

设置某个环境下的配置. `development` 为开发环境, `production` 为生产环境.

例子:

**.silkrc**

```
{
  "extraBabelPlugins": ["transform-runtime"],
  "env": {
    "development": {
      "extraBabelPlugins": ["dva-hmr"]
    }
  }
}
```

配置后, 在开发环境下, `extraBabelPlugins` 为 `["transform-runtime", "dva-hmr"]`, 在生产环境下, `extraBabelPlugins` 为 `["transform-runtime"]`.
  
注意：如果配置项值为数组或对象，则最终得到配置为合并后的数组或对象，如果配置项的值为字符串等其他类型，则会被 env 中配置的值所替换。

### theme

设置 antd 主题。 支持对象和表示less文件路径的字符串。

例子:

**.silkrc**

```
{
  "theme": {
    "@primary-color": "#1DA57A",
    "@link-color": "#1DA57A",
    "@border-radius-base": "2px",
    "@font-size-base": "16px",
    "@line-height-base": "1.2"
  }
}

// or

{
  "theme": "./theme-config.js"
}

```

[如何配置 antd 主题](https://ant.design/docs/react/customize-theme)

### port

设置开发服务器的端口.

### dll

是否开启webpack dll功能。默认为 false。如果开启了dll功能，需要先执行一遍 silk dll，生成 vender.dll.js（注意，该指令只需执行一遍）。之后用 silk server 启动开发调试服务器。


## 智能重启

- [x] 修改以下文件，开发服务器会自动重启。

    * .silkrc
    * theme 配置指定的文件

- [x] 新建一个页面时，开发服务器会自动重启。


## 高级功能

### Mock

##LICENSE

### MIT
