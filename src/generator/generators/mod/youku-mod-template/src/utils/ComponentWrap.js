'use strict';
import React from 'react';
import {Tail} from './Tail.js';

export  class ComponentWrap extends React.Component{
  static defaultProps = {
    hasTail: 0,
    tailText: "",
    tailTextBizType: "",
    tailTextExtra: null,
    tailChangeText: "",
    tailChangeNum: 0,
    tailChangeType: 0
  };
  constructor(props) {
    super(props);
    this.state = {
      hasTail: props.hasTail,
      tailText: props.tailText,
      tailTextBizType: props.tailTextBizType,
      tailTextExtra: props.tailTextExtra,
      tailChangeText: props.tailChangeText,
      tailChangeNum: props.tailChangeNum,
      tailChangeType: props.tailChangeType,
      onChange: props.onChange,//显示更多
      onMoreChange:props.onMoreChange//换一换
    };
  }
  render(){
    const {hasTail, className, dataType, addItem, env} = this.props;
    return(
      <div className="cpnt-view">
      	{
          className ? 
          <div className={className} data-type={dataType||-1}>
            {this.props.children}
            {env === "admin" && addItem && addItem()}
          </div>
          : this.props.children
        }
        {!className && env === "admin" && addItem && addItem()}
      	{hasTail == 2 ? <More {...this.props} onClick={this.props.onChange} /> : ""}
        {hasTail == 1 ? <More {...this.props} onClick={this.props.onMoreChange} /> : ""}
        
      </div>
    );
  }
}

ComponentWrap.displayName = 'ComponentWrap';

export default ComponentWrap;
