import { Avatar, Dropdown, Menu, Icon } from 'antd';
import style from './User.less';

export default function User(){
  const user = window.GV.user;
  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          <Icon type="logout" />&nbsp;&nbsp;退出
        </a>
      </Menu.Item>
    </Menu>
  );
  
  return (
    <div>
      {
        user ?
          <Dropdown overlay={menu}>
          <div className={style.user}>
            <Avatar icon='user' src={user.avatar_url} size='small'/>
            <span className={style.name}>{user.lastName}</span>
          </div>
          </Dropdown> :
          <div className={style.user}>
            <Icon type="login" />&nbsp;登录
          </div>
      }
    </div>
  );
}