# silk

## Introduction

react app 开发cli工具，包括脚手架以及开发调试功能

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

## Advanced features

### Mock
