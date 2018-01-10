'use strict';

import { Input, Button, Icon, Tooltip, Modal } from 'antd';
import FileCardGallery from 'components/FileCardGallery/FileCardGallery';
import FileList from 'components/FileList/FileList';
import EditForm from './EditForm/EditForm';
import './index.less';

class Material extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false, // modal 框是否可见
      modalTitle: '新建项目',
      curData: null, // 当前在处理的数据
      searchValue: '',
      listType: 'appstore-o'  // 列表展示模式，appstore-o 栅格，bars 列表
    };
  }

  handleSearchValueChange = (e) => {
    this.setState({
      searchValue: e.target.value
    });
  }

  onSearch = () => {

  }

  onButtonSearch = () => {

  }

  // 处理列表展示模式变化
  toggleListType = () => {
    let { listType } = this.state;
    listType = listType === 'appstore-o' ? 'bars' : 'appstore-o';
    this.setState({ listType });
  }

  // 新建项目
  handleAdd = () => {
    this.setState({
      visible: true
    });
  }

  handleModalOk = () => {
    this.setState({ visible: false });
  }

  handleModalCancel = () => {
    this.setState({ visible: false });
  }

  refresh = () => {

  }

  render() {
    const {
      visible,
      modalTitle,
      searchValue,
      listType,
      curData
    } = this.state;
    const data = window.GV.fileList || []; // test

    return (
      <div className="materialComponent">
        <div className="box center-align">
          <Input
            className="search-input"
            size="large"
            placeholder="搜索项目或素材"
            onChange={this.handleSearchValueChange}
            onPressEnter={this.onSearch}
            value={searchValue}
            suffix={
              <Button
                className="search-btn"
                size="large"
                type="primary"
                onClick={this.onButtonSearch}
              >
                搜索
              </Button>
            }
          />
          <Button
            size="large"
            type="primary"
            className="new-project-btn"
            onClick={this.handleAdd}
          >
            新建项目
          </Button>
          <div className="search-pull-right">
            <Tooltip placement="top" title="列表／栅格模式切换">
              <Icon type={listType} onClick={this.toggleListType} />
            </Tooltip>
          </div>
        </div>
        <div className="box">
        {
          listType === 'appstore-o' ?
          <FileCardGallery data={data} /> :
          <FileList data={data} />
        }
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
            <EditForm
              isAdd={true}
              data={curData}
              onOk={this.handleModalOk}
              onCancel={this.handleModalCancel}
              refresh={this.refresh}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

Material.displayName = 'Material';
export default Material;
