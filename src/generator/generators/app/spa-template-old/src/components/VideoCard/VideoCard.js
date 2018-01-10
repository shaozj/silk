'use strict';

import { Checkbox } from 'antd';
import './VideoCard.less';

const VideoCard = ({ data, checked, onChangeStatus, showName }) => {
  return (
    <div className="videocardComponent">
      <Checkbox checked={checked} onChange={onChangeStatus}>
        <div className="top">
          <div className="author-name">{data.userName}</div>
          { showName ? <div className="show-name">{showName}</div> : null }
          <img src={data.thumbUrlBig} />
          <div className="time">{'时长：' + data.seconds + '秒'}</div>
        </div>
        <div className="bottom">
          <p className="desc">{data.title}</p>
          <div className="bottom-footer">
            <div>{data.publishTime}</div>
          </div>
        </div>
      </Checkbox>
    </div>
  );
};

export default VideoCard;
