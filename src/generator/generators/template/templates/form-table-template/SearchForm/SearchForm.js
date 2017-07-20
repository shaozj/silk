'use strict';

import React from 'react';
import {Form, Input, Button, Select} from 'antd';
import './SearchForm.less';
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
    const pageMap = window.g_pageMap;
    return (
      <Form layout="inline" className="searchformComponent">
        <div className="form-wrap">
          <FormItem label="方案名称">
            {getFieldDecorator('name')(
              <Input placeholder="请输入方案名称" />
            )}
          </FormItem>
          <FormItem label="方案 ID">
            {getFieldDecorator('id')(
              <Input placeholder="请输入方案 ID" />
            )}
          </FormItem>
          <FormItem label="投放场景">
            {getFieldDecorator('page', {initialValue: ''})(
              <Select>
                <Option key="" value="">全部</Option>
                {
                  Object.keys(pageMap).map(key => {
                    return <Option key={key} value={key}>{pageMap[key].desc}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem label="方案状态">
            {getFieldDecorator('status', {initialValue: ''})(
              <Select>
                <Option value="">全部</Option>
                <Option value="1">上线</Option>
                <Option value="0">下线</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="创建者">
            {getFieldDecorator('creator')(
              <Input placeholder="输入花名或工号" />
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

SearchForm.displayName = 'SearchForm';
const wrappedSearchForm = Form.create()(SearchForm);

export default wrappedSearchForm;

