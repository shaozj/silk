import './ProgramList.less'
import { Checkbox, Row, Pagination, Card, Button, Modal} from 'antd';
import programListMockData from '../../mock/programList';
import RequestManager from 'components/request-manager/request-manager';

const programListData = programListMockData;
const PAGE_SIZE = 49;

export default class ProgramListComponent extends React.Component {
  constructor(props) {
    super(props);
    let total = programListData.length;
    let allCheckStatus = [];
    for (let i = 0; i < total; i++) {
      allCheckStatus.push(true);
    }
    this.state = {
      themeid: -1,
      data: [],
      currentPage: 1,
      allCheckStatus,
      total
    };

  }

  componentDidMount(){

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

  onPageChange(page) {
    this.setState({currentPage: page});
  }

  onCheckChange(index, e) {
    console.log('check index: ' + index);
    console.log('check e: ', e);
    let checked = e.target.checked;
    let {allCheckStatus} = this.state;
    allCheckStatus[index] = checked;
    this.setState({allCheckStatus});
  }

  cancel() {
    // 直接关闭页面，不提交
    window.history.back();
    // window.location.href = '/topic/rule/index.htm';
  }

  confirm() {
    let data = {
      ruleId: this.getUrlParam('ruleId'),
      programIds: ''
    }
    let pArr = [];
    let deleteArr = [];
    this.state.allCheckStatus.forEach((item, index) => {
      if (!item) {
        pArr.push(programListData[index].id);
        deleteArr.push('节目'+index);
      }
    });
    // 没有删除节目，直接回到列表页
    if (pArr.length == 0) {
      window.history.back();
      //window.location.href = '/topic/rule/index.htm';
      return;
    }
    data.programIds = pArr.join(',');
    console.log('post exclude programs data: ', data);
    let self = this;
    Modal.confirm({
      title: '确认框',
      content: '确认删除 '+deleteArr+' 吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return new Promise((resolve, reject) => {
          self.postData(data);
          resolve();
        });
      }
    });
  }

  postData(data) {
    RequestManager.postExcludePrograms(data)
    .then(data => {
      console.log('post exclude programs return: ', data);
      if (data.success == true) {
        Modal.success({
          title: '成功',
          content: '保存节目列表成功'
        });
        setTimeout(()=>{
          window.history.back();
          //window.location.href = '/topic/rule/index.htm';
        }, 800);
      } else {
        Modal.error({
          title: '出错',
          content: '保存节目列表出错，' + data.message
        });
      }
    });
  }

  getUrlParam(name) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp('(^|&)*' + name + '=([^&]*)(&|$)');
    //匹配目标参数
    var r = location.href.match(reg);
    //返回参数值
    if (r != null) return unescape(r[2]);
    return null;
  }

  render(){
    let {allCheckStatus} = this.state;
    let begin = (this.state.currentPage - 1) * PAGE_SIZE;
    let cards = programListData.slice(begin, begin + PAGE_SIZE);
    let card_doms = [];
    cards.forEach((item, index) => {
      let trueIndex = begin + index;
      card_doms.push(
        <Card  key={trueIndex} className="card" style={{ width: '13%' }}>
          <Checkbox checked={allCheckStatus[trueIndex]} onChange={this.onCheckChange.bind(this, trueIndex)}>
            节目{trueIndex}
          </Checkbox>
          <div className='item'>
            <img src={item.picUrl} />
            <p className='txt'>{item.name}</p>
          </div>
        </Card>
      );
    });
    let pageProp = {
      defaultCurrent: 1,
      current: this.state.currentPage,
      pageSize: PAGE_SIZE,
      total: this.state.total,
      onChange: ::this.onPageChange
    };
    return (
      <div>
        <Row>
          <div className='cards_wrap'>
            {card_doms}
            <div className="btn-group">
              <div className="btn-wrap">
                <Button type="primary" htmlType="submit" onClick={::this.confirm} size="large">确认</Button>
                <Button onClick={::this.cancel} size="large">取消</Button>
              </div>
            </div>
          </div>
          <Pagination {...pageProp} /><span className="info">共{this.state.total}条节目</span>
        </Row>
      </div>
    )
  }
}
