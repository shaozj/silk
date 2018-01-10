'use strict';

import React from 'react';
import {
  Form,
  Input,
  Button,
  message,
  Radio,
  Modal,
  Icon
} from 'antd';
import Fetcher from '../Fetcher';
import style from './EditForm.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

let uuid = 0;
class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    const { data } = this.props || {};
    // 处理投放渠道帐号数据结构
    const accounts = data.projectAccounts;
    this.channelAccountArr = accounts && accounts.map(item => item.channel);
    this.initKeys(this.channelAccountArr);
  }

  // 初始化动态增减表单项的 keys
  initKeys(data) {
    uuid = 0;
    let keys = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        keys.push(uuid);
        uuid ++;
      }
    }
    this.props.form.setFieldsValue({ keys });
    if (keys.length <= 0) {
      this.add(); // 创建方案时默认显示一行
    }
  }

  // 删除一行动态增减表单项
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  }

  // 增加一行动态增减表单项
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    form.setFieldsValue({
      keys: nextKeys
    });
    uuid++;
  }

  // 保存
  save = () => {
    // 校验表单，校验成功后提交数据
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          ...values
        };
        data.accounts = data.accounts.filter(item => !!item);

        const { isAdd } = this.props;
        if (isAdd) {
          Fetcher.add(data)
          .then(data => {
            if (data.success == true) {
              message.success('添加方案成功！');
              this.props.refresh && this.props.refresh();
            } else {
              Modal.error({
                title: '接口出错',
                content: '添加方案出错，' + data.message
              });
            }
          });
        } else {
          const id = this.props.data.id;
          Fetcher.update(id, data)
          .then(data => {
            if (data.success == true) {
              message.success('编辑方案成功！');
              this.props.refresh && this.props.refresh();
            } else {
              Modal.error({
                title: '接口出错',
                content: '编辑方案出错，' + data.message
              });
            }
          });
        }
      }
    });
  }

  render() {
    const { isAdd, onCancel } = this.props;
    const data = this.props.data || {};
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 }
    };

    // 动态增减表单项
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    let formItems;
    formItems = keys.map((k) => (
      <FormItem key={k} wrapperCol={{offset: 4, span: 17}}>
        {getFieldDecorator(`accounts[${k}]`, {
          initialValue: this.channelAccountArr && this.channelAccountArr[k]
        })(
          <Input />
        )}
      </FormItem>
    ));

    return (
      <Form className="out-manage-editformComponent modal-form">
        <FormItem
          {...formItemLayout}
          label='方案名称'
        >
          {getFieldDecorator('name', {
            initialValue: data.name,
            rules: [{ required: true, message: '请填写方案名称'}]
          })(
            <Input placeholder="方案名称" />
          )}
        </FormItem>
        <div className={style.formLabel}>投放渠道：</div>
        {
          formItems
        }
        {
          isAdd ?
          <Button type="dashed" onClick={this.add} style={{marginBottom: 15, marginLeft: '30%', width: '30%'}}>
            <Icon type="plus" /> 添加
          </Button> : null
        }
        <FormItem
          {...formItemLayout}
          label='内容要求'
        >
          {getFieldDecorator('type', {
            initialValue: '1'
          })(
            <RadioGroup>
              <Radio value="1">基础模式</Radio>
              <Radio value="2">进阶模式</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <div className="modal-footer">
          <Button type="primary" size="large" onClick={this.save}>保存</Button>
          <Button size="large" style={{ marginLeft: 16 }} onClick={onCancel}>取消</Button>
        </div>
      </Form>
    );
  }
}

EditForm.displayName = 'EditForm';
const WrappedEditForm = Form.create()(EditForm);
export default WrappedEditForm;

