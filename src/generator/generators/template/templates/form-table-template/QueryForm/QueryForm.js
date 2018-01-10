'use strict';

import { Form, Button, Select, Input } from 'antd';
import style from './QueryForm.less';
const FormItem = Form.Item;
const Option = Select.Option;

class QueryForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      channel: ''
    };
  }

  handleSearch = (e) => {
    e && e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 查询内容时要回到第一页
        this.props.onQuery(values, undefined, 1);
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="inline" className="QueryFormComponent">
        <div className={style.formWrap}>
          <FormItem label="投放渠道">
            {getFieldDecorator('channel', {initialValue: ''})(
              <Input />
            )}
          </FormItem>
          <FormItem label="帐号名称">
            {getFieldDecorator('accountId', {initialValue: ''})(
              <Input />
            )}
          </FormItem>
          <FormItem label="状态">
            {getFieldDecorator('status', {initialValue: ''})(
              <Select style={{width: 160}}>
                <Option value="">全部</Option>
                <Option value="1">运行中</Option>
                <Option value="0">已暂停</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="方案名称">
            {getFieldDecorator('name', {initialValue: ''})(
              <Input />
            )}
          </FormItem>
        </div>
        <div className={style.btnGroup}>
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

