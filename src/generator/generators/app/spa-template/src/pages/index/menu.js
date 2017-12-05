import MenuCompile from 'utils/menuCompile';
import NotFoundPage from 'mods/not-found/Loadable';
import ForbiddenPage from 'mods/forbidden/Loadable';
import ListPage from 'mods/list/Loadable';

function IndexPageRoute({ match, location }) {
  const navMap = {
    'notfound': {
      path: '/pageView/notfound',
      component: <NotFoundPage />,
      isNotNav: false,
      title: '404页面'
    },
    'forbidden': {
      icon: 'unlock',
      path: '/pageView/forbidden',
      component: <ForbiddenPage />,
      isNotNav: false,
      title: '没权限页面'
    },
    'listpage': {
      icon: 'unlock',
      path: '/pageView/list',
      component: <ListPage />,
      isNotNav: false,
      title: '列表表单'
    },
    'xspace-cms-report-nav': {
      icon: 'unlock',
      path: '/pageView/source2',
      title: '数据统计',
      subMenus: {
        'xspace-cms-report-by-delivery-project': {
          icon: 'unlock',
          path: '/pageView/source3',
          title: '按项目维度统计',
          component: null
        },
        'xspace-cms-report-by-delivery-task': {
          icon: 'unlock',
          path: '/pageView/source4',
          title: '按资源位维度统计'
        },
        'xspace-cms-report-by-material': {
          icon: 'unlock',
          path: '/pageView/source5',
          title: '按素材维度统计'
        }
      }
    }
  };
  return <MenuCompile match={match} location={location} menuMap={navMap} />;
}

function NextPageRoute({ match, location }) {
  const navMap = {
    'notfound': {
      path: '/pageView1/notfound',
      component: <NotFoundPage />,
      isNotNav: false,
      title: '404页面'
    }
  };
  return <MenuCompile match={match} location={location} menuMap={navMap} />;
}

export default {
  IndexPageRoute,
  NextPageRoute
};

