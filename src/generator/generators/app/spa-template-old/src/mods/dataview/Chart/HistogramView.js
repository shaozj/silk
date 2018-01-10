import Fetcher from '../Fetcher';
import { message } from 'antd';
import createG2 from 'g2-react';

const Chart = createG2(chart => {
  chart.col('positionName', {
    alias: '资源位名称'
  });
  chart.col('exposureNum', {
    alias: '曝光量(单位w)'
  });
  chart
    .interval()
    .position('positionName*exposureNum')
    .tooltip('positionName*exposureNum');
  //注意：否则点击上去会小时
  chart.render();
  // 监听双击事件，这里用于复原图表
});

export default class HistogramView extends React.Component {
  state = {
    data: [{
      positionId: 42,
      positionName: '位置1',
      projectId: 50,
      projectName: '项目1',
      exposureNum: 20,
      taskId: 8,
      exposureUv: null,
      exposureUvRate: null,
      clickNum: null,
      clickUv: null,
      clickUvRate: null,
      exposureConversion: null,
      exposureUvConversion: null,
      passNum: null,
      passRate: null
    },{
      positionId: 29,
      positionName: '位置2',
      projectId: 49,
      projectName: '项目1',
      exposureNum: 20,
      taskId: 16,
      exposureUv: null,
      exposureUvRate: null,
      clickNum: null,
      clickUv: null,
      clickUvRate: null,
      exposureConversion: null,
      exposureUvConversion: null,
      passNum: null,
      passRate: null
    }],
    //某一个项目所有的资源位
    width:document.body.clientWidth * 0.5 + 'px'
  };

  onWindowResize = () => {
    this.setState({
      width:document.body.clientWidth * 0.5 + 'px'
   });
 }

  queryData = (searchData) => {
    Fetcher.getChart(searchData).then(res => {
      const { data } = res;
      if (res.success) {
        this.setState({ data });
      } else {
        message.error('柱状图接口出错' + res.message);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { searchData } = nextProps;
    this.props.queryData(searchData);
  }

  componentDidMount() {
    const { searchData } = this.props;
    //this.props.queryData(searchData);
  }

  render() {
    return (
      <div style={{ width: this.state.width}}>
        <Chart
          forceFit={true}
          data={this.state.data}
          width={500}
          height={315}
        />
      </div>
    );
  }
}
