'use strict';

import { Pagination } from 'antd';
import FileCard from 'components/FileCard/FileCard';
import './FileCardGallery.less';

const FileCardGallery = ({
  data,
  total,
  current,
  pageSize,
  onPageChange,
  onShowSizeChange
}) => {
  return (
    <div className="filecardgalleryComponent">
      <div>
      {
        data.map(item => <FileCard key={item.id} data={item} />)
      }
      </div>
      <Pagination
        showSizeChanger
        showQuickJumper
        total={total || 10}
        pageSize={pageSize || 20}
        current={current || 1}
        onChange={onPageChange}
        onShowSizeChange={onShowSizeChange}
        pageSizeOptions={['20', '40', '60', '80', '100', '200']}
       />
    </div>
  );
};

FileCardGallery.displayName = 'FileCardGallery';

export default FileCardGallery;
