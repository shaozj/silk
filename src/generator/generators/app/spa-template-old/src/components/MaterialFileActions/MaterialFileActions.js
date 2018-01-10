'use strict';

import PropTypes from 'prop-types';
import { Radio, Input, Button, Select } from 'antd';
import './MaterialFileActions.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const Option = Select.Option;

class MaterialFileActions extends React.Component {
  static propTypes = {
    prop: PropTypes.string
  }

  static defaultProps = {
    prop: 'value'
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  handleSortChange = () => {

  }

  render() {
    return (
      <div className="materialfileactionsComponent">
        <RadioGroup defaultValue="a" size="large">
          <RadioButton value="a">视频</RadioButton>
          <RadioButton value="b">图片</RadioButton>
        </RadioGroup>
        <Button type="primary" className="action-btn">手动添加</Button>
        <Button type="primary" className="action-btn">批量删除</Button>
        <span style={{marginLeft: 10}}>共 234 条视频</span>
        <div className="pull-right">
          <Select
            size="large"
            defaultValue="1"
            style={{ width: 120 }}
            onChange={this.handleSortChange}
          >
            <Option value="1">新鲜度倒序</Option>
            <Option value="2">热度倒序</Option>
          </Select>
          <Search
            size="large"
            placeholder="搜索"
            style={{ width: 240, marginLeft: 10 }}
            onSearch={value => console.log(value)}
          />
        </div>
      </div>
    );
  }
}

MaterialFileActions.displayName = 'MaterialFileActions';

export default MaterialFileActions;
