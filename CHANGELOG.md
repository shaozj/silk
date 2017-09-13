## 0.1.40

* build 之前提示build了哪些页面，防止漏了需要 build 的页面
* 提供非压缩版本的build脚本 silk build --debug
* ParallelUglifyPlugin 加速代码压缩

## 8.31 [0.1.48]

支持独立的 react 组件开发，文档： https://lark.alipay.com/jiayufe/coxe99/ymleio

## 9.7  [0.1.49]

 模板 eslint 添加
"semi": 1,
"quotes": [1, "single"],

## 9.13 [0.1.50]

fix: Cannot resolve module 'url-loader' , use require.resolve('url-loader')
