'use strict';

import PropTypes from 'prop-types';
import './FileList.less';

class FileList extends React.Component {
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
      <div className="filelistComponent">
        Please edit src/components/FileList/FileList.js to update this component!
      </div>
    );
  }
}

FileList.displayName = 'FileList';

export default FileList;
