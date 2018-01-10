'use strict';

import { Button } from 'antd';
import style from './index.less';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }

  render(){
    return (
      <div className={style.page}>
        <img className={style.img} src="//gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg" />
        <div className={style.inner}>
          <h4>403</h4>
          <p>抱歉，你无权访问该页面</p>
          <p>请走标准权限申请流程，谢谢！</p>
          <p>或者联系 pd: &nbsp;&nbsp;&nbsp;
            <a href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=z3o4szl">
              <img src="https://img.alicdn.com/tps/TB1Wk4nOXXXXXXTaXXXXXXXXXXX-13-16.png" />
              @少语
            </a>
          </p>
          <a href={'//'+location.host}>
            <Button size='large' type="primary">
              返回首页
            </Button>
          </a>
        </div>
      </div>
    );
  }
}