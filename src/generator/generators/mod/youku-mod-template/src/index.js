// 我是组件代码主体文件，在构建组件线上版本时，我是入口文件
// ⚠️ !important, 由于我们现在的设计，通过拖拽组件生成页面，我们没有在服务端做一次构建的过程
// ⚠️ 为了能将组件组装成页面，需要将组件挂载到 window 上，同时，我们不能在代码中 import 'react'
// ⚠️ 或者 import 'react-dom'，因为这样会把 react 和 react-dom 打包进组件，同时，在我们引用
// ⚠️ 的库中，也不能有 import 'react' 或者 import 'react-dom' 这会导致同样的问题，这点需要切记

import './index.less';
import Base from './base/base.js';
import ComponentWrap  from './utils/ComponentWrap.js';
import {Item, Tag, Img, Summary, SubTitle, Title} from './utils/Elements.js';

class App extends Base {
  constructor(props) {
    super(props);
    this.state = {...props};
  }
  
  render() {
    const {data, coverLay, env} = this.props;
    const items = data.componentItem||[];
    return (
      <ComponentWrap {...data}
        className = "cpnt-fouritem-scroll"
        dataType = {data.type}
        env = {env}
        addItem={::this.addItem}>
          {
            items.map((item,index)=>{
              return (
                <Item href="#" coverLay={coverLay} env={env} coverLayPos={index} key={index} data={item}>
                  <div className="ui-bg">
                    <Img data={item} />
                    <Summary data={item} />
                    <Tag data={item} />
                  </div>
                  <div className="ui-info">
                    <Title data={item} />
                    <SubTitle data={item} />
                  </div>
                </Item>
              );
          })}
      </ComponentWrap>
    );
  }
}

export default App;
window.App = App;

