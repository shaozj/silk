'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

class <%= component.className %> extends React.Component {
  render() {
    return (
      <div className="uniform-cpnt-<%= component.className %>">
        Please edit src/index.js to update this component!
      </div>
    );
  }
}

<%= component.className %>.propTypes = {
  
};

<%= component.className %>.displayName = '<%= component.className %>';

export default <%= component.className %>;
