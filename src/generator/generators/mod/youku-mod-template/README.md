# youku-mod-template

**优酷模块开发模板**  


## Getting start

⚠️ 注意：依赖于 react 开发工具 [silki](https://www.npmjs.com/package/silki)  

`tnpm i silki@latest -g`  
`silk new mod` // 新建一个优酷 h5 组件  
`tnpm install`  
`npm start` // 开启调试服务器  
`npm run build` // 编译

### 模板参数相关

##### env 
* String
* 参数表示是否是后台预览，如果`env==="admin"`表示在后台cms，coverLay和不固定组件增加坑位生效

##### coverLay
* Function
* 用于后台的盖在坑位上的层

### 组件元素

###### ComponentWrap
``` javascript
<ComponentWrap {...data}
  className = "cpnt-fouritem-scroll"
  dataType = {data.type}
  env = {env}
  addItem={::this.addItem}>
```
* dataType:表示数据类型
* env:表示组件所在的环境
* addItem: 增加坑位按钮，这个this.addItem已在Base.js中定义
* env和addItem需配合使用

###### Item

``` javascript
<Item href="#" coverLay={coverLay} env={env} coverLayPos={index} key={index} data={item}></Item>
```
* 表示一个坑位，如果是坑位需要这个包裹


###### Img
* 图片

###### Title
* 标题

###### Summary
* 腰封

###### SubTitle
* 子标题

###### Tag
* 角标

##### 组件数据结构
[http://dip.alibaba-inc.com/api/v2/services/schema/mock/58963](http://dip.alibaba-inc.com/api/v2/services/schema/mock/58963)