'use strict';

import React from 'react';
import {Table, Modal, message} from 'antd';
import moment from 'moment';
import Fetcher from '../Fetcher';
import Switch from '@ali/uniform-react-components/lib/Switch/index';
import './MyTable.less';

class MyTable extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      loading: false,
      visible: false,
      type: null,
      id: null, // 当前要处理的皮肤 id
      curMethodData: null // 当前要处理的皮肤方案数据
    };

    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '方案名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '方案预览',
        dataIndex: 'config',
        key: 'config',
        render: (config) => {
          let img = '';
          try {
            let cfg = JSON.parse(config);
            img = cfg.header.img;
          } catch (err) {
            console.error('解析 config 出错，', err); // eslint-disable-line
          }
          return <img className="refresh-img" src={img} />
        }
      },
      {
        title: '投放场景',
        dataIndex: 'page',
        key: 'page',
        render: page => {
          return window.g_pageMap[page].desc;
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return <Switch value={text}
                  checkedChildren="上线"
                  unCheckedChildren="下线"
                  onChange={(val) => this.handleStatusChange(val, record.id)} />
        }
      },
      {
        title: '投放开始／结束时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        render: (text, record) => {
          return  <div>
                    <div>{moment(record.startTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                    <div>{moment(record.endTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                  </div>
        }
      },
      {
        title: '发布状态',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (text, record) => {
          let {startTime, endTime} = record;
          let time = (new Date()).getTime();
          if (time < startTime) {
            return <span className="red">还未生效</span>;
          } else if (time > endTime) {
            return <span className="red">过期</span>;
          } else {
            return <span className="green">有效</span>;
          }
        }
      },
      {
        title: '创建者',
        dataIndex: 'creator',
        key: 'creator'
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record) => {
          return (
            <div style={{width: 135}}>
              <a onClick={()=> this.props.onEditOrCopy('edit', record.id)}
                href="javascript:void(0)">编辑</a>
              <span className="ant-divider" />
              <a onClick={()=> this.deleteMethod(record.id, record.name)}
                href="javascript:void(0)">删除</a>
            </div>
          );
        }
      }];
  }

  // 处理换肤方案状态变化
  handleStatusChange(status, id) {
    Fetcher.updateMethodStatus({
      data: JSON.stringify({status, id})
    }).then(data => {
      if (data.success == true) {
        message.success('修改换肤方案状态成功！');
        this.props.refresh && this.props.refresh();
      } else {
        Modal.error({
          title: '接口出错',
          content: '修改换肤方案状态出错，' + data.message
        })
      }
    });
  }

  // 删除换肤方案
  deleteMethod(id, name) {
    Modal.confirm({
      title: '确认框',
      content: <div>
                确定删除<span className="red">{name}</span>吗？
                删除后不可恢复哦！
              </div>,
      onOk: () => {
        // 删除换肤方案
        Fetcher.deleteMethod(id)
        .then(data => {
          if (data.success == true) {
            this.props.refresh && this.props.refresh();
          } else {
            Modal.error({
              title: '接口出错',
              content: '删除换肤方案出错，' + data.message
            })
          }
        });
      }
    });
  }

  // 处理页码变化
  handlePageChange = (pageNo, pageSize) => {
    this.props.onPageChange && this.props.onPageChange(pageNo, pageSize);
  }

  render() {
    const {loading} = this.state;
    const {pageNo, total} = this.props;
    const data = this.props.data;

    return (
      <div className="mytableComponent">
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={data}
          loading={loading}
          pagination={{
            total: total,
            current: pageNo,
            pageSize: 10,
            onChange: this.handlePageChange
          }}
        />
      </div>
    );
  }
}

MyTable.displayName = 'MyTable';

export default MyTable;
