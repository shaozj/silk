'use strict';

import { Layout } from 'antd';
import style from './ContentWrap.less';
const { Content, Sider } = Layout;

class ContentWrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: localStorage.getItem('collapsed') === 'true'
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
    const leftOffset = collapsed ? 64 : 200;
    document.querySelector('.ant-layout-right').style.marginLeft = leftOffset + 'px';
    document.querySelector('.page-header').style.marginLeft = leftOffset + 'px';
    localStorage.setItem('collapsed', collapsed);
  }

  render() {
    const { collapsed } = this.state;

    return (
      <div className={style.contentwrapComponent}>
        <Sider style={{ height: '100vh', position: 'fixed', left: 0, zIndex: 20 }}
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
        >
          <div className={style.logo}>单页框架模板</div>
          { this.props.menu }
        </Sider>
        <Content style={{ margin: 16, marginTop: 66 }}>
          <div style={{ minHeight: 580 }}>
            { this.props.children }
          </div>
        </Content>
      </div>
    );
  }
}

export default ContentWrap;
