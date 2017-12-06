import ncp from "copy-paste";

const modalSnippet = `
  <Modal
    key={visible}
    visible={visible}
    title={modalTitle}
    width={window.g_MODAL_WIDTH}
    wrapClassName="vertical-center-modal"
    footer={null}
    onOk={::this.handleModalOk}
    onCancel={::this.handleModalCancel}
    maskClosable={false}
  >
    <div className="modal-content-wrapper">
      <EditForm
        isAdd={isAdd}
        data={curData}
        onOk={this.handleModalOk}
        onCancel={this.handleModalCancel}
      />
    </div>
  </Modal>
`;

const modal2Snippet = `
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
`;

const formSnippet = `
'use strict';

import React from 'react';
import { Form, Button, message, Modal, Select } from 'antd';
import ShowSelect from 'components/ShowSelect/ShowSelect';
import VideoCategorySelect from 'components/VideoCategorySelect/VideoCategorySelect';
import Fetcher from '../../Fetcher';
import './EditForm.less';
const FormItem = Form.Item;
const { Option } = Select;

class EditForm extends React.Component {
  state = {
    poster: ''
  }

  componentDidMount() {
    const { isAdd } = this.props;
    // 编辑的情况，获取节目封面图片
    if (!isAdd) {
      this.getPoster();
    }
  }

  // 获取节目封面图片
  getPoster() {
    const { data } = this.props;
    const { showid } = data;
    Fetcher.getShowByIds(showid + '')
    .then(res => {
      if (res.success !== true) {
        message.error('获取节目封面出错，' + res.message);
        return;
      }
      if (res.data && res.data[showid]) {
        this.setState({ poster: res.data[showid].showThumbUrlBig });
      } else {
        message.error('不存在对应的节目信息');
      }
    });
  }

  save = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { isAdd } = this.props;
        const { id } = this.props.data;
        if (values.showInfo) {
          values.showid = values.showInfo.key;
          values.showname = values.showInfo.label;
          delete values.showInfo;
        }
        if (values.stageType) {
          values.stageType = +values.stageType;
        }
        if (values.showid) {
          values.showid = +values.showid;
        }
        if (isAdd) {
          Fetcher.addLinkVideoConfig(values)
          .then(res => {
            if (res.success !== true) {
              Modal.error({
                title: '接口出错',
                content: '添加短带长配置出错，' + res.message
              });
              return;
            }
            message.success('添加短带长配置成功');
            this.props.onOk();
            this.props.refresh && this.props.refresh();
          });
        } else {
          Fetcher.updateLinkVideoConfig(id, values)
          .then(res => {
            if (res.success !== true) {
              Modal.error({
                title: '接口出错',
                content: '编辑短带长配置出错，' + res.message
              });
              return;
            }
            message.success('编辑短带长配置成功');
            this.props.onOk();
            this.props.refresh && this.props.refresh();
          });
        }
      }
    });
  }

  cancel = () => {
    this.props.onCancel();
  }

  // 处理节目变化时，展示图片变化
  handleShowChange = (showData) => {
    if (showData && showData.showThumbUrlBig) {
      this.setState({ poster: showData.showThumbUrlBig });
    }
  }

  render() {
    const { list } = this.props;
    const { poster } = this.state;
    const data = this.props.data || {};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    };
    const selected = list.map(item => item.category);

    return (
      <Form className="short-link-long-editformComponent">
        <div className="left-form">
          <FormItem
            {...formItemLayout}
            label='频道分类'
          >
            {getFieldDecorator('category',{
              initialValue: data.category
            })(
              <VideoCategorySelect platform="pgy" multiple={false} type="name" selected={selected} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='关联节目'
          >
            {getFieldDecorator('showInfo', {
              initialValue: { key: data.showid && data.showid + '' || '', label: data.showname || '' }
            })(
              <ShowSelect onShowChange={this.handleShowChange} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='关联剧集'
          >
            {getFieldDecorator('stageType', {
              initialValue: data.stageType && data.stageType + '' || '1'
            })(
              <Select>
                <Option value="1">第一集（期）</Option>
                <Option value="-1">最新一集（期）</Option>
              </Select>
            )}
          </FormItem>
        </div>
        <div className="right-form">
          <img className="poster-img" src={poster} />
        </div>

        <div className="modal-footer">
          <Button type="primary" size="large" onClick={this.save}>保存</Button>
          <Button size="large" style={{ marginLeft: 16 }} onClick={this.cancel}>取消</Button>
        </div>
      </Form>
    );
  }
}

EditForm.displayName = 'EditForm';
const WrappeEditForm = Form.create()(EditForm);
export default WrappeEditForm;
`;

const form2Snippet = `
'use strict';

import { Form, Button, Select } from 'antd';
import PgyUserSelect from 'components/PgyUserSelect/PgyUserSelect';
import './QueryForm.less';
const FormItem = Form.Item;
const Option = Select.Option;

.QueryFormComponent {
  .form-wrap {
    display: flex;
    flex-wrap: wrap;
    margin: 5px 0;
  }
  .btn-group {
    margin-bottom: 5px;
  }
  .ant-form-item-control-wrapper {
    min-width: 160px;
  }
  .ant-form-item {
    margin-bottom: 10px;
  }
  label {
    font-weight: 700;
  }
}

class QueryForm extends React.Component {

  handleSearch = (e) => {
    e && e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onQuery(values);
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.onQuery();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" className="QueryFormComponent">
        <div className="form-wrap">
          <FormItem label="合作方">
            {getFieldDecorator('status', {initialValue: ''})(
              <Select>
                <Option value="">全部</Option>
                <Option value="1">上线</Option>
                <Option value="0">下线</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="蒲公英帐号">
            {getFieldDecorator('name', {initialValue: ''})(
              <PgyUserSelect showAll />
            )}
          </FormItem>
          <FormItem label="使用模板">
            {getFieldDecorator('template', {initialValue: ''})(
              <Select>
                <Option value="">全部</Option>
                <Option value="1">上线</Option>
                <Option value="0">下线</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="是否独播">
            {getFieldDecorator('unique', {initialValue: ''})(
              <Select>
                <Option value="">不限制</Option>
                <Option value="1">仅限独播</Option>
                <Option value="0">仅限非独播</Option>
              </Select>
            )}
          </FormItem>
        </div>
        <div className="btn-group">
          <Button style={{marginRight: 10}} type="primary" onClick={this.handleSearch}>查询</Button>
          <Button style={{marginRight: 10}} onClick={this.handleReset}>重置</Button>
          <Button type="primary" onClick={this.props.onAdd}>添加方案</Button>
        </div>
      </Form>
    );
  }
}

QueryForm.displayName = 'QueryForm';
const wrappedQueryForm = Form.create()(QueryForm);
export default wrappedQueryForm;
`;

let copyStr = '没有可复制代码，可选 modal, form, modal2, form2';
switch (process.argv[2]) {
  case 'modal':
    copyStr = modalSnippet;
    break;
  case 'form':
    copyStr = formSnippet;
    break;
  case 'modal2':
    copyStr = modal2Snippet;
    break;
  case 'form2':
    copyStr = form2Snippet;
    break;
  default:
    break;
}

ncp.copy(copyStr, function () {
  console.log(copyStr);
});
