import style from './Tail.less';
import {Base} from '../base/base.js';

export  class Tail extends Base{
  render(){
    const {hasTail, tailText, tailChangeText, coverLay, tailExpandText, tailExpandLine,line} = this.props;
    return (
      <div className="cpnt-more">
      { hasTail==1 ?
          <div className="circle-change">
            <a className="item">
              <s>{tailText}</s>
              {coverLay && coverLay()}
            </a>
            <a className="item" onClick={this.props.onClick}>
              <s>{tailChangeText}</s>
              {coverLay && coverLay()}
            </a>
          </div>:
          <div >
            <a className="item" onClick={this.props.onClick}>
              <s >{tailExpandText||'展开更多'}</s>
            </a>
          </div> }
      </div>
    );
	}

}