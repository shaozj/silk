'use strict';

import React from 'react';
import style from './index.less';

class <%= component.className %> extends React.Component {
  render() {
    const {params, data} = this.props;
    return (
      <div className={style.<%= style.camelClassName %>}>
        render your react component here
      </div>
    );
  }
}

<%= component.className %>.displayName = '<%= component.className %>';

export default <%= component.className %>;

