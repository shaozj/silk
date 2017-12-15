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

import { Form, Button, message, Modal, Select, Input } from 'antd';
import ShowSelect from 'components/ShowSelect/ShowSelect';
import Fetcher from '../../Fetcher';
import './EditForm.less';
const FormItem = Form.Item;
const { Option } = Select;

class EditForm extends React.Component {
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
    const data = this.props.data || {};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 }
    };

    return (
      <Form className="short-link-long-editformComponent">
        <FormItem
          {...formItemLayout}
          label='名称'
        >
          {getFieldDecorator('name',{
            initialValue: data.name
          })(
            <Input />
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

const tableSnippet = `
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '适用范围',
        dataIndex: 'type',
        key: 'type',
        render: type => window.g_PRE_CONFIG_TYPE_MAP[type + '']
      },
      {
        title: '开关板名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '前贴片',
        dataIndex: 'config.headVideoInfo.thumbnail',
        key: 'config.headVideoInfo.thumbnail',
        render: (img, record) => {
          const config = record.config || {};
          const headVideoInfo = config.headVideoInfo || {};
          const vid = headVideoInfo.videoId;
          const url = vid ? URL_BEFORE + vid + URL_AFTER : '';
          const seconds = headVideoInfo.seconds;
          return (
            <a target="_blank" href={url}>
              <div className="img-wrap">
                <img src={img} />
                { seconds ? <span className="duration-info">{seconds} 秒</span> : '' }
              </div>
            </a>
          );
        }
      },
      {
        title: '后贴片',
        dataIndex: 'config.tailVideoInfo.thumbnail',
        key: 'config.tailVideoInfo.thumbnail',
        render: (img, record) => {
          const config = record.config || {};
          const tailVideoInfo = config.tailVideoInfo || {};
          const vid = tailVideoInfo.videoId;
          const url = vid ? URL_BEFORE + vid + URL_AFTER : '';
          const seconds = tailVideoInfo.seconds;
          return (
            <a target="_blank" href={url}>
              <div className="img-wrap">
                <img src={img} />
                { seconds ? <span className="duration-info">{seconds} 秒</span> : '' }
              </div>
            </a>
          );
        }
      },
      {
        title: '是否裁剪',
        dataIndex: 'config.startCutSeconds',
        key: 'config.startCutSeconds',
        render: (img, record) => {
          const config = record.config || {};
          const startCutSeconds = config.startCutSeconds;
          const endCutSeconds = config.endCutSeconds;
          return (startCutSeconds || endCutSeconds) ?
            <div>
              <p>前 {startCutSeconds} 毫秒</p>
              <p>后 {endCutSeconds} 毫秒</p>
            </div> :
            <p>无裁剪</p>;
        }
      },
      {
        title: '更新时间',
        dataIndex: 'updatetime',
        key: 'updatetime',
        render: time => moment(time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作人',
        dataIndex: 'creatorName',
        key: 'creatorName'
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record) => {
          return (
            <div style={{ minWidth: 64 }}>
              <a onClick={() => this.props.onEdit(record.id)}
                href="javascript:void(0)">编辑</a>
              <span className="ant-divider" />
              <a onClick={() => this.deleteMethod(record.id, record.name)}
                className="red"
                href="javascript:void(0)">删除</a>
            </div>
          );
        }
      }];

      <Table
        rowKey="id"
        columns={this.columns}
        dataSource={data}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '40', '60', '80', '100'],
          pageSize: pageSize,
          total: total,
          current: pageNo,
          onChange: onPageChange,
          onShowSizeChange: onShowSizeChange
        }}
      />
`;

let copyStr = '没有可复制代码，可选 modal, form, modal2, form2, table';
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
  case 'table':
    copyStr = tableSnippet;
    break;
  default:
    break;
}

ncp.copy(copyStr, function () {
  console.log(copyStr);
});
