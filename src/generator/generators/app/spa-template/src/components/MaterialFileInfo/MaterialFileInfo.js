'use strict';

import PropTypes from 'prop-types';
import { Tag, Button } from 'antd';
import './MaterialFileInfo.less';

class MaterialFileInfo extends React.Component {
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

  render() {
    return (
      <div className="materialfileinfoComponent">
        <div className="flex-row">
          <label>关联节目：</label>
          <div className="tag-list">
            <Tag color="#2db7f5">大将军司马懿之军事联盟</Tag>
          </div>
          <Button type="primary" className="pull-right">更新配置</Button>
        </div>
        <div className="flex-row">
          <label>关联明星：</label>
          <div className="tag-list">
            <Tag color="#87d068">刘涛</Tag>
            <Tag color="#87d068">吴秀波</Tag>
          </div>
        </div>
        <div className="flex-row">
          <label>上线状态：</label>
          <div className="tag-list">
            <Tag color="green">所有人</Tag>
            <Tag color="orange">部分人</Tag>
            <Tag color="red">下线</Tag>
          </div>
          <div className="pull-right">
            <span className="operate-info">操作人: 少语</span>
            <span className="operate-info">上次更新时间：2017-12-04 23:23:39</span>
          </div>
        </div>
      </div>
    );
  }
}

MaterialFileInfo.displayName = 'MaterialFileInfo';

export default MaterialFileInfo;
