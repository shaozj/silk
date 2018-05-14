// 我是组件代码主体文件，在构建组件线上版本时，我是入口文件

import './index.less';
const YKComponent = window.YKComponent.ykui.YKComponent;
const YKItem = window.YKComponent.ykui.YKItem;
const YKTag = window.YKComponent.ykui.YKTag;
const YKImg = window.YKComponent.ykui.YKImg;
const YKSummary = window.YKComponent.ykui.YKSummary;
const YKSubTitle = window.YKComponent.ykui.YKSubTitle;
const YKTitle = window.YKComponent.ykui.YKTitle;
const Base = window.YKComponent.ykui.Base;

class App extends Base {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }

  render() {
    const {
      data = { componentItem: [], type: '' },
      coverLay,
      env
    } = this.state;
    const items = (data && data.componentItem) || [];

    return (
      <YKComponent
        {...data}
        className="ykui-two-items"
        dataType={data && data.type}
        env={env}
        addItem={::this.addItem}
      >
      {
        items.map((item, index) => {
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
        })
      }
      </YKComponent >
    );
  }
}

export default App;
window.YKComponent = window.YKComponent || {};
window.YKComponent.ykui = window.YKComponent.ykui || {};
window.YKComponent.ykui['ykui-two-items'] = App;
