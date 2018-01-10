'use strict';

import { Breadcrumb, Spin } from 'antd';
import { Link } from 'react-router-dom';
import MaterialFileInfo from 'components/MaterialFileInfo/MaterialFileInfo';
import MaterialFileActions from 'components/MaterialFileActions/MaterialFileActions';
import VideoGallery from 'components/VideoGallery/VideoGallery';
import './MaterialVideo.less';

class MaterialVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      videoList: null,
      checkedMap: {},
      total: 0,
      current: 1,
      pageSize: 20
    };
  }

  onVideoCardChangeStatus = () => {

  }

  onPageChange = () => {

  }

  onShowSizeChange = () => {

  }

  render() {
    const {
      loading,
      videoList,
      checkedMap,
      total,
      current,
      pageSize
    } = this.state;

    return (
      <div className="materialvideoComponent">
        <div className="box">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="material">素材库</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              军师联盟
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="box">
          <MaterialFileInfo />
        </div>
        <div className="box">
          <MaterialFileActions />
        </div>
        <div className="box">
          <Spin spinning={loading} size="large">
            <VideoGallery
              videoList={videoList}
              checkedMap={checkedMap}
              total={total}
              current={current}
              pageSize={pageSize}
              onVideoCardChangeStatus={this.onVideoCardChangeStatus}
              onPageChange={this.onPageChange}
              onShowSizeChange={this.onShowSizeChange}
            />
          </Spin>
        </div>
      </div>
    );
  }
}

MaterialVideo.displayName = 'MaterialVideo';

export default MaterialVideo;
