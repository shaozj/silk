// 蒲公英帐号选择

'use strict';

import PropTypes from 'prop-types';
import Fetcher from './Fetcher';
import { Select, Modal } from  'antd';
import './PgyUserSelect.less';
const Option = Select.Option;

class PgyUserSelect extends React.Component {
  static propTypes = {
    showAll: PropTypes.bool,  // 是否展示全部选项
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    onChange: PropTypes.func,
    getPopupContainer: PropTypes.func // 下拉选项的位置
  }

  static defaultProps = {
    showAll: false
  }

  constructor(props) {
    super(props);

    this.state = {
      accountList: [],
      value: this.props.value
    };
  }

  componentDidMount() {
    this.queryUserlist();
  }

  // 获取蒲公英帐号列表
  queryUserlist() {
    const { type='' } = this.props;
    Fetcher.queryUserlist({ pageSize: 500, type })
    .then(res => {
      if (res.success != true) {
        Modal.error({
          title: '接口出错',
          content: '获取蒲公英帐号列表出错，' + res.message
        });
        return;
      }
      this.setState({
        accountList: res.data.data
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value });
    }
  }

  handleChange = (value) => {
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    const onChange = this.props.onChange;
    onChange && onChange(value);
  }

  render() {
    let { value, accountList } = this.state;
    const { mode, showAll } = this.props;
    if(showAll && mode !== 'multiple'){
      accountList = [{id:'', uname: '全部'}].concat(accountList);
    }
    return (
      <div className="PgyUserSelectComponent">
        <Select
          size="large"
          value={value}
          showSearch
          onChange={this.handleChange}
          style={{minWidth: 100}}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          getPopupContainer={this.props.getPopupContainer}
          mode={mode}
        >
          {
            accountList && accountList.map((i, k) => {
              return <Option key={k} value={i.id+''}>{i.uname}</Option>;
            })
          }
        </Select>
      </div>
    );
  }
}

PgyUserSelect.displayName = 'PgyUserSelect';

export default PgyUserSelect;
