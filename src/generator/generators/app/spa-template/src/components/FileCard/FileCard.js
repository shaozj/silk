'use strict';

import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './FileCard.less';

const scopeMap = {
  'all': {
    desc: '所有人',
    color: 'green'
  },
  'part': {
    desc: '部分人',
    color: 'orange'
  },
  'offline': {
    desc: '下线',
    color: 'red'
  }
};

class FileCard extends React.Component {
  static propTypes = {
    data: PropTypes.object  // 文件卡片数据
  }

  static defaultProps = {
    data: {}
  }

  render() {
    const { data } = this.props;

    return (
      <div className="filecardComponent">
        <Link to="material-video">
          <div className="filecard-top">
            <img src={data.showImg} />
          </div>
          <div className="filecard-bottom">
            <p className="filecard-title">
              {data.title}
            </p>
            <div className="filecard-tag-list">
              <Tag color="pink">图片：{data.imgCount}</Tag>
              <Tag color="purple">视频：{data.videoCount}</Tag>
              <br/>
              <Tag color={scopeMap[data.scope].color} className="bottom-tag">{scopeMap[data.scope].desc}</Tag>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

FileCard.displayName = 'FileCard';

export default FileCard;
