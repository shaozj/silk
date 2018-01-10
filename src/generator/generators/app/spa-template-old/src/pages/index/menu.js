import MenuCompile from 'utils/menuCompile';
import NotFound from 'mods/not-found/Loadable';
import Forbidden from 'mods/forbidden/Loadable';
import List from 'mods/list/Loadable';
import Data from 'mods/dataview/Loadable';
import Material from 'mods/Material/Loadable';
import MaterialVideo from 'mods/MaterialVideo/Loadable';

function IndexPageRoute({ match, location }){
  const navMap = {
    'materialpage': {
      icon: 'database',
      path: '/pageView/material',
      component: <Material />,
      isNotNav: false,
      title: '素材库'
    },
    'listpage': {
      icon: 'file-ppt',
      path: '/pageView/list',
      component: <List />,
      isNotNav: false,
      title: '列表表单'
    },
    'materialvideopage': {
      icon: 'database',
      path: '/pageView/material-video',
      component: <MaterialVideo />,
      isNotNav: true,
      title: '素材库'
    },
    'xspace-cms-report-nav': {
      icon: 'line-chart',
      title: '数据统计',
      subMenus: {
        'xspace-cms-report-by-delivery-project': {
          icon: 'area-chart',
          path: '/pageView/source3',
          title: '按项目维度统计',
          component: <Data />
        }
      }
    },
    'notfound': {
      path: '/pageView/notfound',
      component: <NotFound />,
      isNotNav: false,
      icon: 'meh-o',
      title: '404页面'
    },
    'forbidden': {
      icon: 'frown',
      path: '/pageView/forbidden',
      component: <Forbidden />,
      isNotNav: false,
      title: '没权限页面'
    }
  };
  return <MenuCompile match={match} location={location} menuMap={navMap} />;
}

function NextPageRoute({ match, location }) {
  const navMap = {
    'notfound': {
      path: '/pageView1/notfound',
      component: <NotFound />,
      isNotNav: false,
      title: '404页面'
    }
  };
  return <MenuCompile match={match} location={location} menuMap={navMap} />;
}

function SecondPageRoute({ match, location }) {
  const navMap = {
    'notfound': {
      path: '/pageView2/notfound',
      component: <NotFound />,
      isNotNav: true,
      title: '404页面'
    }
  };
  return <MenuCompile match={match} location={location} menuMap={navMap} />;
}

export default {
  IndexPageRoute,
  NextPageRoute,
  SecondPageRoute
};

