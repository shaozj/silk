'use strict';

import { Modal } from 'antd';
import Fetcher from './Fetcher';
import QueryForm from './QueryForm/QueryForm';
import List from './List/List';
import EditForm from './EditForm/EditForm';

export default class OutManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,            // 列表数据是否加载中
      visible: false,           // modal 框是否可见
      listData: [],             // 列表数据
      queryValues: {},          // 查询参数
      curData: null,            // 当前处理的数据
      isAdd: true,              // 是否为添加方案，true 为添加，false 为编辑
      modalTitle: '添加方案',    // modal 框 title
      pageNo: 1,                // 页码
      pageSize: 20,             // 每页显示个数
      total: 0                  // 搜索到的总数
    };
  }

  componentDidMount() {
    this.getList();
  }

  // 获取列表数据
  getList = (
    query=this.state.queryValues,
    pageSize=this.state.pageSize,
    pageNo=this.state.pageNo
  ) => {
    this.setState({ loading: true });
    if (query !== this.state.queryValues) {
      this.setState({ queryValues: query });
    }
    if (pageNo !== this.state.pageNo) {
      this.setState({ pageNo });
    }
    query.pageSize = pageSize;
    query.pageNo = pageNo;

    Fetcher.getList(query)
    .then(res => {
      this.setState({ loading: false });
      if (res.success !== true) {
        Modal.error({
          title: '接口出错',
          content: '获取列表数据出错，' + res.message
        });
        return;
      }
      this.setState({
        listData: res.data.data,
        total: res.data.totalCount
      });
    });
  }

  // 添加方案
  handleAdd = () => {
    this.setState({
      curData: {},
      isAdd: true,
      visible: true,
      modalTitle: '添加方案'
    });
  }

  // 编辑方案
  handleEdit = (id) => {
    Fetcher.get(id)
    .then(res => {
      if (res.success !== true) {
        Modal.error({
          title: '接口出错',
          content: '获取一条方案出错，' + res.message
        });
        return;
      }
      this.setState({
        curData: res.data,
        isAdd: false,
        visible: true,
        modalTitle: '编辑方案'
      });
    });
  }

  // 点击 modal 框保存
  handleModalOk = () => {
    this.setState({ visible: false });
  }

  // 点击 modal 框取消
  handleModalCancel = () => {
    this.setState({ visible: false });
  }

  // 刷新页面
  refresh = () => {
    this.setState({ visible: false });
    this.getList();
  }

  // 处理表格页码变化
  handlePageChange = (pageNo) => {
    const { pageSize, queryValues } = this.state;
    this.setState({ pageNo });
    this.getList(queryValues, pageSize, pageNo);
  }

  // 处理每页显示个数变化
  handleShowSizeChange = (pageNo, pageSize) => {
    const { queryValues } = this.state;
    this.setState({ pageNo, pageSize });
    this.getList(queryValues, pageSize, pageNo);
  }

  render() {
    const {
      loading,
      visible,
      listData,
      curData,
      isAdd,
      modalTitle,
      pageNo,
      pageSize,
      total
    } = this.state;

    return (
      <div className="outManageComponent">
        <div className="box">
          <div className="query-form__title-bar">
            筛选条件
          </div>
          <QueryForm
            onAdd={this.handleAdd}
            onQuery={this.getList}
          />
        </div>
        <div className="box">
          <List
            loading={loading}
            data={listData}
            pageNo={pageNo}
            pageSize={pageSize}
            total={total}
            onPageChange={this.handlePageChange}
            onShowSizeChange={this.handleShowSizeChange}
            onEdit={this.handleEdit}
            onDistributeEdit={this.handleDistributeEdit}
            refresh={this.refresh}
          />
        </div>
        <Modal
          key={visible}
          visible={visible}
          title={modalTitle}
          width={window.g_MODAL_WIDTH}
          wrapClassName="vertical-center-modal"
          footer={null}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          maskClosable={false}
        >
          <div className="modal-content-wrapper">
          {
            <EditForm
              isAdd={isAdd}
              data={curData}
              onOk={this.handleModalOk}
              onCancel={this.handleModalCancel}
              refresh={this.refresh}
            />
          }
          </div>
        </Modal>
      </div>
    );
  }
}
