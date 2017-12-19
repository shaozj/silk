import ContentWrap from 'components/ContentWrap/ContentWrap';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
const SubMenu = Menu.SubMenu;

export default function menuCompile({menuMap, location, authority, isAuthority = false}){
  let authorityData = [];
  const getAuthorityData = (authorityTree) => {
    authorityTree && authorityTree.map((i) => {
      authorityData.push(i.menuName);
      if(!i.leaf){
        return getAuthorityData(i.subMenus);
      }
    });
  };
  authority && getAuthorityData(authority.subMenus);
  
  const getMenu = (data) => {
    return data && Object.keys(data).map((k) => {
      let i = data[k];
      if(!i.isNotNav && (authorityData.indexOf(k)!==-1 || !isAuthority)){
        if(!i.subMenus){
          return (
            <Menu.Item key={k}>
              <Link to={i.path}>
                {
                  i.icon ? <Icon type={i.icon} /> : null
                }
                <span className="nav-text">{i.title}</span>
              </Link>
            </Menu.Item>
          );
        }else{
          return (
            <SubMenu key={k} title={
              <span>
                {
                  i.icon ? <Icon type={i.icon} /> : null
                }
                <span>{i.title}</span>
              </span>
            }>
              {getMenu(i.subMenus)}
            </SubMenu>
          );
        }
      }
    });
  };


  const routeMap = (menuMap, route) => {
    let cur = null;
    for(let j = 0; j < Object.keys(menuMap).length; j++){
      let i = Object.keys(menuMap)[j];
      if(menuMap[i].subMenus){
        cur = routeMap(menuMap[i].subMenus, route);
        if(cur){
          break;
        }
      }else if(menuMap[i].path == route){
         cur = { data:menuMap[i], key:i };
         break;
      }
    }
    return cur;
  };

  const getOpenKey = (menuMap) => {
    let openKey = [];
    for(let j = 0; j < Object.keys(menuMap).length; j++){
      let i = Object.keys(menuMap)[j];
      if(menuMap[i].subMenus){
        openKey.push(i);
      }
    }
    return openKey;
  };

  const curMenu = routeMap( menuMap, location.pathname );
  const menus = getMenu(menuMap);
  const openKey = getOpenKey(menuMap);
  const menu = (
    <Menu theme="dark" mode="inline"
      defaultSelectedKeys={[ (curMenu && curMenu.key) || '1' ]}
      className="side-menu"
      defaultOpenKeys={openKey}
    >
      {menus}
    </Menu>
  );

  const content = curMenu && curMenu.data.component;
  return (
    <ContentWrap menu={menu}>
      { content }
    </ContentWrap>
  );
}