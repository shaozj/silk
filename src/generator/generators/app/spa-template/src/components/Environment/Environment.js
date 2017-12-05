import { Menu, Dropdown, Icon } from 'antd';
import style from './Environment.less';

export default class Environment extends React.Component{
  constructor(props){
    super(props);
    this.envMap = {
      online:{
        host:'//dandelion-platform.alibaba-inc.com',
        desc:'线上'
      },
      pre:{
        host:'//pre-dandelion-platform.alibaba-inc.com',
        desc:'预发'
      },
      daily:{
        host:'//dandelion-platform.alibaba.net',
        desc:'日常'
      }
    };

    this.state = {
      name:this.getNowEnv()
    };
  }

  getNowEnv = ()=>{
    let host = location.host;
    let envMap = this.envMap;
    if(host.indexOf(envMap.pre.host.replace('//',''))!==-1){
      return '预发';
    }else if(host.indexOf(envMap.online.host.replace('//',''))!==-1){
      return '线上';
    }else{
      return '日常';
    }
  }
  
  render(){
    const menu = (
      <Menu>
        {
          Object.keys(this.envMap).map(k=>{
            return <Menu.Item key={k}>
                    <a href={this.envMap[k].host}>{this.envMap[k].desc}</a>
                   </Menu.Item>;
          })
        }
      </Menu>
    );
    const {name} = this.state;
    return (
      <div className={style.environment}>
        <Dropdown overlay={menu} trigger={['hover']}>
          {
            name == '日常' ?
              <a className={style.envChange}>
                <Icon type="setting" style={{marginRight:'3px'}}/>切换环境<span style={{color:'#54d474', marginLeft:'3px'}}>[{name}]</span>
              </a> :
              <a className={style.envChange}>
                <Icon type="setting" style={{marginRight:'3px'}}/>切换环境<span style={{color:'red', marginLeft:'3px'}}>[{name}]</span>
              </a>
          }
        </Dropdown>
      </div>
    );
  }

}