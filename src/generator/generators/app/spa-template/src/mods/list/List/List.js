'use strict';

import { Table, Modal, message, Popconfirm } from 'antd';
import moment from 'moment';
import Fetcher from '../Fetcher';
import Switch from '@ali/uniform-react-components/lib/Switch/index';
import './List.less';

class List extends React.Component {
  constructor(props) {
    super(props);

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
        title: '分类指定',
        dataIndex: 'category',
        key: 'category'
      },
      {
        title: '预览图',
        dataIndex: 'showNames',
        key: 'showNames',
        render: () => <img src="https://img.alicdn.com/tfs/TB1X6LQcPuhSKJjSspjXXci8VXa-64-64.png" alt=""/>
      },
      {
        title: '蒲公英指定',
        dataIndex: 'pgyNames',
        key: 'pgyNames'
      },
      {
        title: '版权指定',
        dataIndex: 'isPublicCopywright',
        key: 'isPublicCopywright'
      },
      {
        title: '屏蔽策略',
        dataIndex: 'isExclusive',
        key: 'isExclusive',
        render: isExclusive => isExclusive ? '有' : '无'
      },
      {
        title: '最后修改',
        dataIndex: 'modifierName',
        key: 'modifierName'
      },
      {
        title: '最后修改时间',
        dataIndex: 'gmtModified',
        key: 'gmtModified',
        render: time => moment(time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          <div style={{width: 74}}>
            <Switch
              value={text}
              checkedChildren="运行中"
              unCheckedChildren="已暂停"
              onChange={(val) => this.handleStatusChange(val, record.id)}
            />
          </div>
        )
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record) => {
          return (
            <div style={{minWidth: 70}}>
              <a onClick={()=> this.props.onEdit(record.id)}
                href="javascript:void(0)">编辑</a>
              <span className="ant-divider" />
              <Popconfirm
                title="确定删除吗？删除后不可恢复哦！"
                onConfirm={() => this.delete(record.id)}
              >
                <a className="red" href="javascript:void(0)">删除</a>
              </Popconfirm>
            </div>
          );
        }
      }];
  }

  // 处理状态变化
  handleStatusChange(status, id) {
    Fetcher.setStatus(id, status)
    .then(data => {
      if (data.success == true) {
        message.success('修改方案状态成功！');
        this.props.refresh && this.props.refresh();
      } else {
        Modal.error({
          title: '接口出错',
          content: '修改方案状态出错，' + data.message
        });
      }
    });
  }

  // 删除
  delete(id) {
    Fetcher.deleteMethod(id)
    .then(data => {
      if (data.success === true) {
        this.props.refresh && this.props.refresh();
      } else {
        Modal.error({
          title: '接口出错',
          content: '删除方案出错，' + data.message
        });
      }
    });
  }

  render() {
    const {
      data,
      loading,
      pageNo,
      pageSize,
      total,
      onPageChange,
      onShowSizeChange
    } = this.props;

    return (
      <div className="ListComponent">
        <Table
          rowKey="id"
          columns={this.columns}
          dataSource={data}
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: pageSize,
            current: pageNo,
            total: total,
            onChange: onPageChange,
            onShowSizeChange: onShowSizeChange,
            pageSizeOptions: ['10', '20', '40', '60', '80', '100'],
            showTotal: total => `共 ${total} 条`
          }}
        />
      </div>
    );
  }
}

List.displayName = 'List';

export default List;
