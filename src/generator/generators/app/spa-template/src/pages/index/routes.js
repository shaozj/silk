/**
 * 页面路由配置
 * path: 路由路径
 * redirectTo: 重定向页面
 * component: 该路径对应渲染的页面（组件）
 */

import Loadable from 'react-loadable';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import Layout from 'components/Layout/Layout';

// 动态按需加载组件，首次展现时加载相关 js，并缓存
const DynamicLoad = ({ loader }) => {
  const Cpnt = Loadable({
    loader,
    loading: LoadingIndicator
  });
  return <Cpnt />;
};

// 权限校验，当传入 forbidden 为 true 时，展示无访问权限页面
const Authentication = ({ children, forbidden }) => {
  return (
    forbidden
      ? <DynamicLoad loader={() =>
          import(/* webpackChunkName: "forbidden-page" */'mods/forbidden/index')}/>
      : children
  );
};

const routes = [
  {
    path: '/pageView',
    redirectTo: '/pageView/material'
  },
  {
    path: '/pageView2',
    redirectTo: '/pageView2/empty'
  },
  {
    path: '/',
    redirectTo: '/pageView/material'
  },
  {
    path: '/pageView/material',
    component: () => (
      <Layout navFocus = {{topNavKey: '1', leftNavKey: '1'}}>
        <Authentication>
          <DynamicLoad loader={() =>
            import(/* webpackChunkName: "delivery-material" */'mods/Material/index')}/>
        </Authentication>
      </Layout>
    )
  },
  {
    path: '/pageView/list',
    component: () => (
      <Layout navFocus = {{topNavKey: '1', leftNavKey: '2'}}>
        <DynamicLoad loader={() =>
          import(/* webpackChunkName: "list-page" */'mods/list/index')}/>
      </Layout>
    )
  },
  {
    path: '/pageView/material-video',
    component: () => (
      <Layout navFocus = {{topNavKey: '1', leftNavKey: '1'}}>
        <DynamicLoad loader={() =>
          import(/* webpackChunkName: "delivery-material-video" */'mods/MaterialVideo/MaterialVideo')}/>
      </Layout>
    )
  },
  {
    path: '/pageView/source3',
    component: () => (
      <Layout navFocus = {{topNavKey: '1', leftNavKey: '3'}}>
        <DynamicLoad loader={() =>
          import(/* webpackChunkName: "data-page" */'mods/dataview/index')}/>
      </Layout>
    )
  },
  {
    path: '/pageView2/empty',
    component: () => (
      <Layout navFocus = {{topNavKey: '2', leftNavKey: '1'}}>
        <Authentication forbidden>
        </Authentication>
      </Layout>
    )
  },
  {
    path: '/pageView/forbidden',
    component: () => (
      <Layout navFocus = {{topNavKey: '1', leftNavKey: '2'}}>
        <DynamicLoad loader={() =>
          import(/* webpackChunkName: "forbidden-page" */'mods/forbidden/index')}/>
      </Layout>
    )
  },
  {
    path: '/pageView/notfound',
    component: () => <DynamicLoad loader={() =>
      import(/* webpackChunkName: "not-found-page" */'mods/not-found/index')}/>
  },
  {
    path: '*',
    component: () => <DynamicLoad loader={() =>
      import(/* webpackChunkName: "not-found-page" */'mods/not-found/index')}/>
  }
];

export default routes;
