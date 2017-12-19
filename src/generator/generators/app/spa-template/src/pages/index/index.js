import { Switch, Route, Redirect, Router, Link, withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import style from './index.less';
import Environment from 'components/Environment/Environment';
import User from 'components/User/User';
import { IndexPageRoute, NotPageRoute, SecondPageRoute } from './menu';
const { Header, Footer } = Layout;
import history from './history';

const RouteMap = {
  '/': '1',
  '/pageView': '1',
  '/pageView1': '2'
};

class Wrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    const collapsed = localStorage.getItem('collapsed') === 'true';
    const leftOffset = collapsed ? 64 : 200;
    this.state = {
      leftOffset
    };
  }

  render() {
    const { leftOffset } = this.state;
    const { location } = this.props;
    const route = '/' + location.pathname.split('/')[1];
    const curKey = RouteMap[route];

    return (
      <div className={style.wrapper}>
        <Layout style={{ minHeight: '100vh', marginLeft: leftOffset }} className="ant-layout-right">
          <Header style={{ marginLeft: leftOffset }} className="page-header">
            <div className={style.right}>
              <Environment />
              <User />
            </div>
            <Menu
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={[ curKey || '1']}
              className={style.menu}
            >
              <Menu.Item key="1"><Link to="/pageView/list">一级导航1</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/pageView2/notfound">一级导航2</Link></Menu.Item>
            </Menu>
          </Header>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/pageView/material"/>} />
            <Route path="/pageView/:subMenuId" component={ IndexPageRoute }/>
            <Route path="/pageView2/:subMenuId" component={ SecondPageRoute }/>
            <Route path="*" component={ NotPageRoute }/>
          </Switch>
          <Footer style={{ textAlign: 'center' }}>
            优酷管理平台 ©2017 Created by 优酷管理平台团队
          </Footer>
        </Layout>
      </div>
    );
  }
}

Wrapper.displayName = 'Wrapper';
const WrapperWithRouter = withRouter(Wrapper);
const MyRouter = () => <Router history={history}><WrapperWithRouter /></Router>;
export default MyRouter;

ReactDOM.render(<MyRouter />, document.getElementById('app'));
