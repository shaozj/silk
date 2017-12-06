'use strict';

import PropTypes from 'prop-types';
import style from './<%= style.webpackPath %>';

class <%= component.className %> extends React.Component {
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
      <div className={style.<%= style.camelClassName %>}>
        Please edit <%= component.path %><%= component.fileName %> to update this component!
      </div>
    );
  }
}

<%= component.className %>.displayName = '<%= component.displayName %>';

export default <%= component.className %>;
