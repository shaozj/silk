'use strict';

import './UploadImg.less';
import { Upload, Icon, Modal } from 'antd';
import classNames from 'classnames';

class UploadImg extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    imgUrl: ''
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    console.log(file.url);
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  }

  handleChange = ({ fileList }) => {
    let imgUrl = fileList[0] && fileList[0].response && fileList[0].response.data.path;
    this.setState({
      fileList,
      imgUrl: imgUrl
    });
    this.props.onImgChange(imgUrl);
    console.log(imgUrl);
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    let errorClassName = classNames({
      'ant-form-explain-error': true,
      'has-err': this.props.hasErr
    });
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix upload-img">
        <Upload
          action={`${window.imgUploadHost}/common/ajaxUploadImg.json`}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          withCredentials={true}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <div className={errorClassName}>请上传背景图片!</div>
      </div>
    );
  }
}

export default UploadImg;
