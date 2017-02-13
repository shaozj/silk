import './App.less';
import ProgramList from 'components/programList/ProgramListComponent.js';

class ProgramListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }

  componentDidMount() {
    // get program list data
    // 数据直接写在页面上，无需通过接口获取
  }

  render(){
    return (
        <div className="program-list-wrap">
          <ProgramList />
        </div>
    );
  }
}

// hack 检测 js 页面渲染是否完成，完成后更新页面 body 高度以撑开 iframe
// 在后台 iframe 架构改造完成后，删除这段代码
function check() {
  // 在这里写你自已的标准
  return document.querySelector('span.info');
}
function waitForReady() {
  if (!check()) {
    return setTimeout(waitForReady, 50); // 每50毫秒检查一下
  }
  else {
    console.log('js render ready');
    document.body.style.height = document.body.scrollHeight + 'px';
  }
}
waitForReady();

export default ProgramListPage;
