'use strict';

import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import style from './SearchForm.less';
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component {

  handleSearch = (e) => {
    e && e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 参数返回父组件，父组件去请求数据
        this.props.onSearch(values);
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.onSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" className={style.searchformComponent}>
        <div className='searchformComponent__formWrap'>
          <FormItem label="方案名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入位置名称" />
              )}
            </FormItem>
          <FormItem label="ID">
            {getFieldDecorator('id')(
              <Input placeholder="请输入位置 ID" />
            )}
          </FormItem>
        </div>
        <div className={style.btnGroup}>
          <Button style={{marginRight: 10}} type="primary" onClick={this.handleSearch}>查询</Button>
          <Button style={{marginRight: 10}} onClick={this.handleReset}>重置</Button>
        </div>
      </Form>
    );
  }
}

SearchForm.displayName = 'SearchForm';
const wrappedSearchForm = Form.create()(SearchForm);

export default wrappedSearchForm;

