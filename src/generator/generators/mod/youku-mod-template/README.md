# youku-mod-template

**优酷模块开发模板**  


## Getting start

⚠️ 注意：依赖于 react 开发工具 [silki](https://www.npmjs.com/package/silki)  

`tnpm i silki@latest -g`  
`mkdir newModName && cd newModName`  
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
见[http://gitlab.alibaba-inc.com/ykui/yk-base/wikis/home](http://gitlab.alibaba-inc.com/ykui/yk-base/wikis/home)

##### 组件数据结构
[http://dip.alibaba-inc.com/api/v2/services/schema/mock/58963](http://dip.alibaba-inc.com/api/v2/services/schema/mock/58963)