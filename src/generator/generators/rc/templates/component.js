'use strict';

import React from 'react';
import style from './index.less';

class Cpnt extends React.Component {
  render() {
    const {params, data} = this.props;
    return (
      <div className={style.<%= style.camelClassName %>}>
        render your react component here
      </div>
    );
  }
}

class <%= component.className %> {
  /**
   * <%= component.className %> 组件
   * @param {Dom} mountNode
   * @param {Array} data
   * @param {Object} params see <https://ant.design/components/carousel-cn/>
   */
  constructor(mountNode, data, params) {
    ReactDOM.render (<Cpnt params={params} data={data} />, mountNode);
  }
}

<%= component.className %>.displayName = '<%= component.className %>';

export default <%= component.className %>;
window.rc_<%= component.className %> = <%= component.className %>;

