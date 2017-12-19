'use strict';

import { Pagination } from 'antd';
import VideoCard from 'components/VideoCard/VideoCard';
import './VideoGallery.less';

const VideoGallery = ({
  showMap,
  videoList,
  checkedMap,
  total,
  current,
  pageSize,
  onVideoCardChangeStatus,
  onPageChange,
  onShowSizeChange
}) => {
    const begin = (current - 1) * pageSize;
    const end = current * pageSize;

    return (
      <div className="videogalleryComponent">
        <div className="video-gallery">
          {
            videoList && videoList.length > 0 &&
            videoList.slice(begin, end).map((item) => (
              <VideoCard
                key={item.videoId}
                checked={checkedMap[item.videoId]}
                data={item}
                showName={showMap[item.showLongId] && showMap[item.showLongId].showName}
                onChangeStatus={e => onVideoCardChangeStatus(e, item.videoId)} />
            )) || <div className="no-data">亲，没有获取到视频呢 ～, ～</div>
          }
        </div>
        <Pagination showSizeChanger showQuickJumper
          total={total}
          pageSize={pageSize}
          current={current}
          onChange={onPageChange}
          onShowSizeChange={onShowSizeChange}
          pageSizeOptions={['20', '40', '60', '80', '100', '200']}
         />
      </div>
    );
};

VideoGallery.displayName = 'VideoGallery';

export default VideoGallery;
