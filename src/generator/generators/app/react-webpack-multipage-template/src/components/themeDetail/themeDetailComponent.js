import './themeDetail.less'
import {Row, Col} from 'antd';

export default class ThemeDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }
  componentWillMount(){
      this.setState({data:this.props.data});
  }
  componentWillReceiveProps(nextProps){
      let {data} = this.state;
      let _data = nextProps.data;
      if(data == _data){
          return false;
      }else{
          this.setState({data:_data});
      }
  }
 
  render(){
    console.log('render');
    let data = this.state.data;
    console.log(data)
    return (<div className='detailwrap'>
              <Row className='mod'>
                  <Row><h3>配置规则</h3></Row>
                  <Row>
                    <Col span={2}>规则ID</Col>
                    <Col span={10}>4</Col>
                    <Col span={2}>规则名称</Col>
                    <Col span={10}>90年代的香港电影</Col>
                  </Row>
                  <Row>
                    <Col span={2}>规则类型</Col>
                    <Col span={10}></Col>
                    <Col span={2}>标签策略</Col>
                    <Col span={10}>与</Col>
                  </Row>
                  <Row>
                    <Col span={2}>创建人员</Col>
                    <Col span={10}>87013</Col>
                    <Col span={2}>更新人员</Col>
                    <Col span={10}>87013</Col>
                  </Row>
                  <Row>
                    <Col span={2}>创建时间</Col>
                    <Col span={10}>2016-11-29 18:39:00</Col>
                    <Col span={2}>更新时间</Col>
                    <Col span={10}>2016-11-29 18:39:00</Col>
                  </Row>
                  <Row>
                    <Col span={2}>规则描述</Col>
                    <Col span={10}></Col>
                  </Row>
              </Row>
              
              <Row className='mod'>
                <Row><h3>节目聚合</h3></Row>
                <Row>
                 <div className='nums'>
                 数量：<a href=''>434</a>&nbsp;&nbsp;
                 独立CIBN牌照节目数量：<a href=''>434</a>  &nbsp;&nbsp;
                 独立华数牌照节目数量：134   &nbsp;&nbsp;
                 CIBN&华数双牌照的节目数量：<a href=''>434</a>
                 </div>
                </Row>
              </Row>
              
              
              <Row className='mod'>
                <Row>
                 <h3>主题对应的专题</h3>
                </Row>
                <Row>
                  <Col span={24}>
                    <a href='#' className='tag'>专题名称：专题ID</a>
                    <a href='#' className='tag'>专题名称：专题ID</a>
                    <a href='#' className='tag'>专题名称：专题ID</a>
                  </Col>
                 </Row>
              </Row>
              
              <Row className='mod'>
                  <Row>
                     <h3>媒资标签</h3>
                  </Row>
                  <Row>
                   <Col span={24}>
                      <span className='tag'>电影</span>
                      <span className='tag'>动作</span>
                   </Col>
                  </Row>
              </Row>
              <Row className='mod'>
                  <Row>
                     <h3>运营标签</h3>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <span className='tag'>奥斯卡获奖</span>
                   </Col>
                 </Row>
              </Row>
            </div>);
           
    
  }
}
