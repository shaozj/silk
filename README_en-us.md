# silk

## Introduction

React app develop cli tool, include scaffold and develop debug features, support react multiple pages develop.  
  
Support css less sass/scss stylus.


[view on github](https://github.com/shaozj/silk)

## Installation

```bash
$ sudo npm install silki -g
```

## Usage

> new a react multiple page app

```bash
$ silk new
```

> new a react app page

```bash
$ silk page <name>
```

> new a react app component

```bash
$ silk cpnt <name>
```

> build code & start a develop server

```bash
$ silk server
```

> build code to file, default to ./build folder

```bash
$ silk build
```

> show help

```bash
$ silk -h
```

> show version

```bash
$ silk --version
```

## Configuration

* Configuration is stored in the **.silkrc** file
* JSON format, comments allowed

Default configuration:

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


## Advanced features

### Mock

##LICENSE

### MIT
