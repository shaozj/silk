'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import <%= component.className %> from './index';

class Test extends React.Component {
  render() {
    return <<%= component.className %> />;
  }
}

ReactDOM.render(<Test />, document.getElementById('app'));
