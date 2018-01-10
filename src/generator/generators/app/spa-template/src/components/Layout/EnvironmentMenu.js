import { Dropdown, Menu, Icon } from 'antd';
import style from './EnvironmentMenu.less';

export default class EnvironmentMenu extends React.Component{
  render(){
    const { data }= this.props;
    const host = location.host;

    let now = data && data.find((i) => {
      return i.url.indexOf(host) > -1;
    }) || data[0];

    const menu = (
      <Menu>
        {
          data && data.map((i) => (
            <Menu.Item key={i.key}><a href={i.url}>{i.text}</a></Menu.Item>
          ))
        }
      </Menu>
    );
    
    return (
      <Dropdown overlay={menu} className={style.env}>
        <div className={style.ct} data-type={now.key}>
          <span className={style.cur}>
            <Icon type="setting" /><span className={style.changeBtn}>切换环境</span><b><u>[</u>{now.text}<u>]</u></b>
          </span>
        </div>
      </Dropdown>
    );
  }

}