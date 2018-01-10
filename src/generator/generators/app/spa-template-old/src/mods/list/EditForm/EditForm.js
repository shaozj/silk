'use strict';

import React from 'react';
import { Form, Input, Button, message, DatePicker, Alert, Radio, Modal } from 'antd';
import moment from 'moment';
import Switch from '@ali/uniform-react-components/lib/Switch/index';
import UploadImg from '@ali/uniform-react-components/lib/UploadImg/index';
import Fetcher from '../Fetcher';
import './EditForm.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;

const BottomSkinArr = [
  {
    label: '首页icon'
  },
  {
    label: '发现icon'
  },
  {
    label: '会员icon'
  },
  {
    label: '星球icon'
  },
  {
    label: '我的icon'
  }
];

class EditForm extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {

    };
  }

  save() {
    // get form data & submit
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values: ', values);
        const data = {
          ...values,
          startTime: values.rangeTime && values.rangeTime[0] && values.rangeTime[0].format('x'),
          endTime: values.rangeTime && values.rangeTime[1] && values.rangeTime[1].format('x'),
          configType: 'skin' // 写死
        }
        const {type} = this.props;
        switch(type) {
          case 'add':
            Fetcher.addMethod({
              data: JSON.stringify(data)
            })
            .then(data => {
              if (data.success == true) {
                message.success('添加皮肤方案成功！');
                this.props.refresh && this.props.refresh();
              } else {
                Modal.error({
                  title: '接口出错',
                  content: '添加皮肤方案出错，' + data.message
                })
              }
            });
            break;
          case 'edit':
            data.id = this.props.id;
            Fetcher.updateMethod({
              data: JSON.stringify(data)
            })
            .then(data => {
              if (data.success == true) {
                message.success('编辑皮肤方案成功！');
                this.props.refresh && this.props.refresh();
              } else {
                Modal.error({
                  title: '接口出错',
                  content: '编辑皮肤方案出错，' + data.message
                })
              }
            });
            break;
          default:
            break;
        }
        
      }
    });
  }

  validatorCouple = (field) => {
    // a 变了，重新设置 b 的值，这样触发 b 校验
    const {getFieldValue, setFieldsValue} = this.props.form;
    const value = getFieldValue(field);
    const obj = {};
    obj[field] = value;
    setFieldsValue(obj);
  }

  cancel() {
    this.props.onCancel();
  }

  render() {
    const data = this.props.data || {};
    let config = data.config;
    const {getFieldDecorator, getFieldsValue} = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 11 }
    };

    const values = getFieldsValue();
    const curPage = values.page || data.page || 'MAIN'; // 表单中当前的 page 值

    if (config) {
      try {
        config = JSON.parse(config);
      } catch (err) {
        console.error('解析 config 出错，', err); // eslint-disable-line
      }
    }

    const curConfig = values.config || config; // 表单中当前的 config 值

    let rangeTime = undefined;
    if (data.startTime && data.endTime) {
      rangeTime = [moment(data.startTime, 'x'), moment(data.endTime, 'x')];
    }

    // iconName
    getFieldDecorator('config.bottom[0].iconName', { initialValue: config && config.bottom[0].iconName || '首页' });
    getFieldDecorator('config.bottom[1].iconName', { initialValue: config && config.bottom[1].iconName || '发现' });
    getFieldDecorator('config.bottom[2].iconName', { initialValue: config && config.bottom[2].iconName || '会员' });
    getFieldDecorator('config.bottom[3].iconName', { initialValue: config && config.bottom[3].iconName || '星球' });
    getFieldDecorator('config.bottom[4].iconName', { initialValue: config && config.bottom[4].iconName || '我的' });

    return (
      <Form className="editformComponent">
        <FormItem
          {...formItemLayout}
          label='方案名称'
          required={true}
        >
          {getFieldDecorator('name', {
            initialValue: data.name,
            rules: [{ required: true, message: '请填写方案名称'}]
          })(
            <Input placeholder="方案名称" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="生效时间"
          required={true}
        >
          {getFieldDecorator('rangeTime',
            {
              initialValue: rangeTime,
              rules: [{ required: true, type: 'array', message: '请选择生效时间'}]
            })(
              <RangePicker style={{width: '100%'}} showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='描述'
        >
          {getFieldDecorator('description', {
            initialValue: data.description
          })(
            <Input type="textarea" placeholder="描述" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上下线"
          required={true}
        >
          {getFieldDecorator('status', { initialValue: data.status == 0 ? 0 : 1})(
            <Switch checkedChildren={'上线'} unCheckedChildren={'下线'} />
          )}
        </FormItem>
        
        <div className="modal-footer">
          <Button type="primary" size="large" onClick={::this.save}>保存</Button>
          <Button size="large" style={{ marginLeft: 16 }} onClick={::this.cancel}>取消</Button>
        </div>
      </Form>
    );
  }
}

EditForm.displayName = 'EditForm';
const WrappedEditForm = Form.create()(EditForm);
export default WrappedEditForm;

