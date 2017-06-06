// 我是组件代码主体文件，在构建组件线上版本时，我是入口文件
// ⚠️ !important, 由于我们现在的设计，通过拖拽组件生成页面，我们没有在服务端做一次构建的过程
// ⚠️ 为了能将组件组装成页面，需要将组件挂载到 window 上，同时，我们不能在代码中 import 'react'
// ⚠️ 或者 import 'react-dom'，因为这样会把 react 和 react-dom 打包进组件，同时，在我们引用
// ⚠️ 的库中，也不能有 import 'react' 或者 import 'react-dom' 这会导致同样的问题，这点需要切记

import './index.less';
import {YKComponent,YKItem, YKTag, YKImg, YKSummary, YKSubTitle, YKTitle, Base} from '@ali/yk-base';
class App extends Base {
  constructor(props) {
    super(props);
    this.state = {...props};
  }
  render() {
    const {data = {componentItem:[],type:""}, coverLay, env} = this.state;
    const items =  (data && data.componentItem)||[];
    return (
      <YKComponent {...data}
        className = "ykui-two-items"
        dataType = {data && data.type}
        env = {env}
        addItem={::this.addItem}>
          {
            items.map((item,index)=>{
              return (
                <YKItem href="#" className="ui-item item" coverLay={coverLay} env={env} coverLayPos={index} key={index} data={item}>
                  <div className="ui-bg">
                    <YKImg data={item} />
                    <YKSummary data={item} />
                    <YKTag data={item} />
                  </div>
                  <div className="ui-info">
                    <YKTitle data={item} />
                    <YKSubTitle data={item} />
                  </div>
                </YKItem>
              );
          })}
      </YKComponent>
    );
  }
}

export default App;
window.YKComponent = window.YKComponent || {};
window.YKComponent.ykui = window.YKComponent.ykui || {};
window.YKComponent.ykui['ykui-two-items'] = App;

