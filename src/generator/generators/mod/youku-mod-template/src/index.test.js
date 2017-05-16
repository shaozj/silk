// 我是测试用文件，构建组件线上版本时，不需要我
// 在开发调试时，我是入口文件

import './index.test.less';
import Cpnt from './index';
import './mock/data.js';

//env 参数表示是否是后台预览，如果env===admin表示在后台cms，coverLay和不固定组件增加坑位生效

ReactDOM.render (<Cpnt data={window.mockData} env="admin" coverLay={()=>{}}/>, document.getElementById('app'));
