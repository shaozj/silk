'use strict';

// mock
import './mock/mock';

import React from 'react';
import ReactDOM from 'react-dom';
import {Modal} from 'antd';
import Fetcher from './Fetcher';
import SearchForm from './SearchForm/SearchForm';
import MyTable from './MyTable/MyTable';
import EditForm from './EditForm/EditForm';
import './index.less';

const PAGE_SIZE = 10;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data:[],
      searchValues: null, // 搜索参数
      pageNo: 1,
      total: 0, // 搜索到的总的换肤方案个数
      id: null,
      type: 'add',
      modalTitle: '创建换肤方案'
    };
  }

  componentDidMount() {
    this.getTableValue();
  }

  // 获取 table 内容
  getTableValue() {
    this.searchMethod();
  }

  // 搜索方案
  searchMethod = (values, pageNo=1) => {
    this.setState({searchValues: values});
    let params = null;
    if (!values) {
      values = {
        pageNo: pageNo,
        pageSize: PAGE_SIZE,
        configType: 'skin'
      }
    } else {
      Object.keys(values).map(key => {
        if (values[key] == undefined) {
          delete values[key];
        }
      });
      values.pageNo = pageNo;
      values.pageSize = PAGE_SIZE;
      values.configType = 'skin';
    }
    params = {data: JSON.stringify(values)};
    Fetcher.searchMethod(params)
    .then(data => {
      if (data.success == true) {
        this.setState({
          data: data.data.data,
          total: data.data.totalCount
        });
      } else {
        Modal.error({
          title: '接口失败',
          content: '搜索换肤方案出错，' + data.message
        });
      }
    })
  }

  // 添加换肤方案
  addMethod = () => {
    this.setState({
      curMethodData: {},
      visible: true,
      type: 'add',
      modalTitle: '创建换肤方案'
    });
  }

  // 编辑或拷贝换肤方案
  editOrCopyMethod = (type, id) => {
    // 获取当前皮肤方案信息
    Fetcher.getMethodInfo(id)
    .then(data => {
      if (data.success == true) {
        if (type == 'copy') {
          data.data.title = data.data.title + '_复制'
        }
        this.setState({
          id,
          type,
          curMethodData: data.data,
          visible: true,
          modalTitle: type == 'edit' ? '编辑换肤方案' : '复制换肤方案'
        });
      } else {
        Modal.error({
          title: '接口出错',
          content: '获取当前换肤方案信息出错，' + data.message
        });
      }
    });
  }

  handleModalOk() {
    this.setState({ visible: false });
  }

  handleModalCancel() {
    this.setState({ visible: false });
  }

  // 刷新页面
  refresh = () => {
    this.setState({ visible: false });
    const { searchValues, pageNo } = this.state;
    this.searchMethod(searchValues, pageNo);
  }

  // 处理表格页码变化
  handlePageChange = (pageNo) => {
    const {searchValues} = this.state;
    this.setState({pageNo});
    this.searchMethod(searchValues, pageNo);
  }

  render() {
    const {data, visible, pageNo, total, modalTitle, id, type, curMethodData} = this.state;

    return (
      <div className="skinConfigComponent">
        <div className="mod">
          <div className="search-form__title-bar">
            筛选条件
          </div>
          <SearchForm
            onAdd={this.addMethod}
            onSearch={this.searchMethod}
          />
        </div>
        <div className="mod">
          <MyTable data={data}
            onEditOrCopy={this.editOrCopyMethod}
            pageNo={pageNo}
            total={total}
            onPageChange={this.handlePageChange}
            refresh={this.refresh} />
        </div>
        <Modal
          key={visible}
          visible={visible}
          title={modalTitle}
          width={760}
          wrapClassName="vertical-center-modal"
          footer={null}
          onOk={::this.handleModalOk}
          onCancel={::this.handleModalCancel}
          maskClosable={false}
        >
          <div className="modal-content-wrapper">
            <EditForm
              type={type}
              id={id}
              data={curMethodData}
              refresh={this.refresh}
              onOk={::this.handleModalOk}
              onCancel={::this.handleModalCancel}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render (<App />, document.getElementById('app'));
