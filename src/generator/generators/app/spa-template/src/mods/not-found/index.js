'use strict';

import { Button } from 'antd';
import style from './index.less';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }

  render(){
    return (
      <div className={style.error}>
        <img src="//gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg" />
        <div className={style.inner}>
          <h4>404</h4>
          <p>抱歉，你访问的页面不存在</p>
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

export default Page;
