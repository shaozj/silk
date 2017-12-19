'use strict';

import { Form, Button, message, Modal, Select, Input, Radio } from 'antd';
import ShowSelect from 'components/ShowSelect/ShowSelect';
import PgyUserSelect from 'components/PgyUserSelect/PgyUserSelect';
import Fetcher from '../Fetcher';
import './EditForm.less';
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

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
      <Form className="material-editformComponent">
        <FormItem
          {...formItemLayout}
          label='项目名称'
        >
          {getFieldDecorator('name',{
            initialValue: data.name,
            rules: [{ required: true, message: '请填写项目名称'}]
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
          <Button style={{marginLeft: 10}} type="primary" size="small">添加节目</Button>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='关联明星'
        >
          {getFieldDecorator('star', {
            initialValue: data.star && data.star + '' || '1'
          })(
            <Select>
              <Option value="1">第一集（期）</Option>
              <Option value="-1">最新一集（期）</Option>
            </Select>
          )}
          <Button style={{marginLeft: 10}} type="primary" size="small">添加明星</Button>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='发布状态'
        >
          {getFieldDecorator('scope', {
            initialValue: data.scope && data.scope + '' || '1'
          })(
            <RadioGroup>
              <Radio value="1">下线</Radio>
              <Radio value="2">部分人</Radio>
              <Radio value="3">所有人</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='生效账号'
        >
          {getFieldDecorator('pgyIds', {
            initialValue: data.pgyIds || [],
            rules: [{ required: true, message: '请选择需要关联的蒲公英账号'}]
          })(
            <PgyUserSelect mode='multiple' type='0'/>
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
