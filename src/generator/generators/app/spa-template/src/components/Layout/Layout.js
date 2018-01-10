/**
 * 页面外部框架，包括一级导航栏和二级导航栏
 */

import style from './Layout.less';
import { Menu, Icon, Layout as layout } from 'antd';
import { Link } from 'react-router-dom';
import LeftNav from './LeftNav';
import EnvironmentMenu from './EnvironmentMenu';
import User from './User';
import Forbidden from 'mods/forbidden/index';
const { SubMenu } = Menu;
const { Sider } = layout;
const environment = [
  {
    key: 'daily',
    url: '//taobao.com',
    text: '测试'
  },
  {
    key: 'pre',
    url: '//taobao.com',
    text: '预发'
  },
  {
    key: 'online',
    url: '//taobao.com',
    text: '线上'
  }
];

class Layout extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

  render(){
    const { children, navFocus={}, forbidden } = this.props;
    const { collapsed } = this.state;
    return (
      <div className={`cpntLayout ${style.layout} ${collapsed ? style.collapsed : ''}`}>
        <div className={`${style.sidebar}`}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={this.onCollapse}
            className={style.sidebarInner}
            width='230'
          >
            <a href='#' className={style.logo}>
              <img src='//img.alicdn.com/tfs/TB1arPIl8TH8KJjy0FiXXcRsXXa-400-420.png' width='40' height='40'/>
              <h1>Demo平台</h1>
            </a>
            {/*左侧导航 start*/}
            <LeftNav curTop={navFocus.topNavKey} curLeft={navFocus.leftNavKey}>
              <Menu
                parentKey="1"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="dark"
                className={style.menuList}
              >
                <Menu.Item key='1'>
                  <Link to='/pageView/material'>
                    <Icon type="picture" /><span>素材库</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key='2'>
                  <Link to='/pageView/list'>
                    <Icon type="bars" /><span>列表表单</span>
                  </Link>
                </Menu.Item>
                <SubMenu key="sub1" title={<span><Icon type="appstore" /><span>数据统计</span></span>}>
                  <Menu.Item key="3">
                    <Link to='/pageView/source3'>
                      <Icon type="appstore" /><span>按项目维度统计</span>
                    </Link>
                  </Menu.Item>
                </SubMenu>
              </Menu>
              <Menu
                parentKey="2"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="dark"
                className={style.menuList}
              >
                <Menu.Item key='1'>
                  <Link to='/pageView2/empty'>
                    <Icon type="picture" /><span>403 页面</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key='2'>
                  <Link to='/pageView/notfound'>
                    <Icon type="picture" /><span>404 页面</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </LeftNav>
            {/*左侧导航 end*/}
          </Sider>
        </div>
        <div className={style.wrap}>
          <div className={style.header}>
            <div className={style.topMenu}>
              {/**顶部导航 start**/}
              <Menu
                mode="horizontal"
                selectedKeys={[navFocus.topNavKey]}
              >
                <Menu.Item key="1">
                  <Link to='/pageView'>顶部导航1</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to='/pageView2'>顶部导航2</Link>
                </Menu.Item>
              </Menu>
              {/**顶部导航end**/}
            </div>
            <div className={style.more}>
              <div className={style.env}>
                <EnvironmentMenu data={environment}/>
              </div>
              <div className={style.user}>
                <User />
              </div>
            </div>
          </div>
          <div className={style.main}>
            {
              !forbidden ? children : <Forbidden />
            }
          </div>
          <div className={style.footer}>
            Copyright<Icon type="copyright" />2018 优酷前端团队
          </div>
        </div>
      </div>
    );

  }
}

Layout.displayName = 'Layout';
export default Layout;
