import { Table, Modal } from 'antd';
import ProgramListComponent from '../programList/ProgramListComponent';
import ThemeDetailComponent from '../themeDetail/themeDetailComponent';

const confirm = Modal.confirm;

export default class ThemeSearchListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,//显示节目列表pop
      detail_visible: false,//显示主题详情pop
      theme_id:-1,
      data:[],//搜索列表数据
      data_themedetail:[],//主题详情
      data_programs:[]//节目列表数据
    };
  }
  confirm() {
    confirm({
        title: '确定要删除该主题吗?!!',
        content: '点击确定后, 弹窗会在1s后关闭',
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log('Oops errors!'));
        },
        onCancel() {}
    });
  }
  confirmOffline() {
    confirm({
        title: '确定要下线该主题吗?',
        content: '点击确定后, 弹窗会在1s后关闭',
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log('Oops errors!'));
        },
        onCancel() {}
    });
  }
  themeContainer(){

  }
  showProgramModal(id) {
    //获取主题列表数据
    let data = [];
    this.setState({
      visible: true,
      theme_id: id,
      data_programs:data
    });
  }
  showDetailModal(id) {
    //获取详情数据
    let data = [];
    this.setState({
      detail_visible: true,
      theme_id: id,
      data_themedetail:data
    });
  }
  handleOk() {
    this.setState({
      ModalText: '弹窗会在2s后关闭',
      confirmLoading: true
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false
      });
    }, 2000);
  }
  handleCancel() {
    console.log('Clicked cancel button');
    this.setState({
      visible: false
    });
  }
  handleDetailOk() {
    this.setState({
      ModalText: '弹窗会在2s后关闭',
      confirmLoading: true
    });
    setTimeout(() => {
      this.setState({
        detail_visible: false,
        detail_confirmLoading: false
      });
    }, 2000);
  }
  handleDetailCancel() {
    console.log('Clicked cancel button');
    this.setState({
      detail_visible: false
    });
  }
  componentWillMount(){
    let data = [];
    for(let i = 0; i < 300; i++) {
      let id = Math.floor(Math.random() * 300);
      let item = {
        key: i,
        id: id,
        theme: '动作片大集合',
        type: '节目',
        from: '运营自建',
        rule: '与',
        contains:'1223',
        author:'aa',
        status:'发布'
      };
      data.push(item);
    }
    this.setState({'data':data});
  }
  render() {
    let columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '运营主题名称',
      dataIndex: 'theme',
      key: 'theme',
      render: (text,record) => <a href='#' onClick={() => this.showDetailModal(record.id)}>{record.id}{text}</a>
    }, {
      title: '数据类型',
      dataIndex: 'type',
      key: 'type'
    },{
      title: '来源',
      dataIndex: 'from',
      key: 'from'
    },{
      title: '规则策略',
      dataIndex: 'rule',
      key: 'rule'
    },{
      title: '包含的节目',
      dataIndex: 'contains',
      key: 'contains',
      render: (text,record) => <a href='#' onClick={() => this.showProgramModal(record.id)}>{text}</a>
    },{
      title: '创建者',
      dataIndex: 'author',
      key: 'author'
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status'
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href='#'>编辑</a>
          <span className='ant-divider' />
          <a href='#' onClick={this.confirmOffline}>下线</a>
          <span className='ant-divider' />
          <a onClick={this.confirm}>删除</a>
        </span>
      )
    }];

    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          className='theme-list'
          pagination={{pageSize: 20}}
        />
        <Modal wrapClassName='program-list-wrap' title='该主题下节目预览' width={'96%'}
               visible={this.state.visible}
               onOk={() => this.handleOk()}
               confirmLoading={this.state.confirmLoading}
               onCancel={() => this.handleCancel()}>
                  <ProgramListComponent  data={this.state.data_programs} themeid={this.state.theme_id}/>
        </Modal>
        <Modal wrapClassName='theme-list-wrap' title='主题详情页' width={'96%'}
               visible={this.state.detail_visible}
               onOk={() => this.handleDetailOk()}
               confirmLoading={this.state.detail_confirmLoading}
               onCancel={() => this.handleDetailCancel()}>
                  <ThemeDetailComponent data={this.state.data_themedetail} themeid={this.state.theme_id}/>
        </Modal>
      </div>
    );
  }
}
