/**
 * 搜索节目，返回 showid 和 showname
 * 支持被 Form 组件 getFieldDecorator 包装，数据双向绑定
 */
'use strict';

import { Select, Spin, Modal, message, Tag } from 'antd';
import Fetcher from './Fetcher';
import './ShowSelect.less';
const Option = Select.Option;

class ShowSelect extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    let initialValue = {};
    if (this.props.value) {
      initialValue = this.props.value;
    }
    this.state = {
      dataSource: [],
      dataMap: {},
      value: initialValue,
      fetching: false
    };
    // this.getMetaDataInfo(this.props.value.split(','));
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      let value = [];
      if (nextProps.value) {
        value = nextProps.value;
      } else {
        value = '';
      }
      this.setState({ value });
      // this.getMetaDataInfo(nextProps.value.split(','));
    }
  }

  // 根据元数据 ids 获取元数据
  getMetaDataInfo(ids) {
    if (!ids || ids.length <= 0 || ids[0] == '') {
      return;
    }
    Fetcher.searchMetaData({
      ids,
      pageSize: 1000
    })
    .then(res => {
      if (res.success == true) {
        const value = res.data.data.map(item => {
          return {
            key: item.id+'',
            label: `${item.titleBak} id: ${item.id}`
          };
        });
        this.setState({ value });
      } else {
        message.error('根据元数据 ids 获取元数据失败，' + res.message);
      }
    });
  }

  // 搜索节目
  fetchData = (key) => {
    if (!key) {
      return;
    }
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ fetching: true });

    Fetcher.searchShow(key)
    .then((res) => {
      if (fetchId !== this.lastFetchId) { // for fetch callback order
        return;
      }
      if (res.success == true) {
        if (!res.data || res.data.length == 0) {
          this.setState({dataSource: [], fetching: false});
          return;
        }

        const dataMap = {};
        const dataSource = res.data.map(item => {
          dataMap[item.showLongId] = item;
          return {
            label: item.showName,
            key: item.showLongId
          };
        });

        this.setState({ dataSource, dataMap });
      } else {
        Modal.error({
          title: '失败',
          content: '搜索节目失败，' + res.message
        });
      }
    });
  }

  // 处理选中的数据变化
  handleChange = (value) => {
    this.setState({
      value,
      data: [],
      fetching: false
    });

    const { dataMap } = this.state;
    const { onChange, onShowChange } = this.props;
    onChange && onChange(value);
    onShowChange && onShowChange(dataMap[value.key]);
  }

  render() {
    const { fetching, dataSource, value } = this.state;

    return (
      <div className="ShowSelectComponent">
        <Select
          size="large"
          showSearch
          labelInValue
          value={value}
          placeholder="搜索节目"
          notFoundContent={fetching ? <Spin size="small" /> : <Tag color="blue">未搜索到节目</Tag>}
          filterOption={false}
          onSearch={this.fetchData}
          onChange={this.handleChange}
          onSelect={this.props.onSelect}
          style={{ minWidth: 150 }}
        >
          {dataSource && dataSource.map(d => <Option key={d.key}>{d.label}</Option>)}
        </Select>
      </div>
    );
  }
}

ShowSelect.displayName = 'ShowSelect';

export default ShowSelect;
