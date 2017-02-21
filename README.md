# silk

## 介绍

react app 开发cli工具，包括脚手架以及开发调试功能，支持开发 react 多页面 app。 
  
支持多种css预处理语言，包括 less sass/scss stylus.


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

An entry is a starting point of a page. The `entry` property specify a webpack entry property. see [webpack entry](https://webpack.js.org/concepts/#entry). The difference between silkrc and webpack config is that silk entry support glob.
An example is seen below:

**.silkrc**

```
{
  "entry": "src/pages/**/index.js",
}
```

### disableCSSModules

Disable css modules, default false. [see css modules](https://github.com/css-modules/css-modules)

### publicPath

Set production environment publicPath, develop environment default '/' . [see webpack output.publicPath](http://webpack.github.io/docs/configuration.html#output-publicpath)

### outputPath

Set output directory. [see webpack output.path](http://webpack.github.io/docs/configuration.html#output-path)

### extraBabelPlugins

Set extra babel plugins. Only support add, not support replace and delete.
Below is an babel-plugin-import example:

**.silkrc**

```
{
  "extraBabelPlugins": [
  ["import", { "libraryName": "antd", "libraryDirectory": "lib", "style": "css" }]
    ]
}
```

### extraPostCSSPlugins

Set extra postcss plugins. Current not support.

### autoprefixer

Set autoprefixer, see [autoprefixer](https://github.com/postcss/autoprefixer) and [browserslist](https://github.com/ai/browserslist#queries)

Example:

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

Set proxy, see [webpack dev server proxy](https://webpack.github.io/docs/webpack-dev-server.html#proxy)

Example:

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

Set webpack externals. see [webpack externals](http://webpack.github.io/docs/configuration.html#externals)

### multipage

Speficy if has multiple pages. Default true.

### define

Specify the DefinePlugin configuration of webpack. The value will be transform by JSON.stringify automatically. see [webpack DefinePlugin](http://webpack.github.io/docs/list-of-plugins.html#defineplugin)

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

Set specific options for certain environment. `development` is for server, and `production` is for build.

Example:

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

Then, in development environment, `extraBabelPlugins` is `["transform-runtime", "dva-hmr"]`, in production environment, `extraBabelPlugins` is `["transform-runtime"]`.

### theme

Set antd theme. Support Object and String with filepath.

Example:

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

[how to config antd theme](https://ant.design/docs/react/customize-theme)

### port

Set develop server port.


## 高级功能

### Mock

##LICENSE

### MIT
