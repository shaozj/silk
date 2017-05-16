'use strict';
import ImgUtils from '../utils/ImgUtils.js';

export  class Base extends React.Component{
  static defaultProps = {
    data_base:{
      id: -1,
      grayChangeList: null,
      sceneScope: 0,
      title: "",
      subtitle: "",
      titleBak: "",
      imgTitle: "",
      img: "",
      bizType: "",
      extra: null,
      itemType: "",
      itemProperty: null,
      cornerMarkId: 0,
      deliveryRuleIds: "",
      status: 1
    },
    data:[],
    row:1,
    line:0,
    expand:false,
    changeCount:1,
    coverLay:()=>{return ''}
  };
  constructor(props, defaultProps) {
    super(props,defaultProps);
    this.state = {
      coverLay:props.coverLay,
      data_base:props.data_base,
      data:props.data,
      row:props.row,
      changeCount:1,
      coverLay:props.coverLay,
      line:(props.data && props.data.line)||0
    };
  }

  addItem(cb){
   return <a href="javascript:;" className="ui-item" onClick={()=>{this.addNewItem(cb)}}>
            <div className="ui-bg ui-img-plus"></div>
          </a>
  }

  componentWillReceiveProps(nextProps){
    if(nextProps && nextProps.data){
      if(this.state.expand && nextProps.data.hasTail==2){
        this.setState({line:nextProps.data.line+nextProps.data.tailExpandLine,changeCount:1});
      }else if(this.state.changeCount>1 && nextProps.data.hasTail==1){
        this.setState({line:nextProps.data.line*this.state.changeCount});
      }else{
         this.setState({line:nextProps.data.line,changeCount:1});
      }
    }
    
  }
  //点击更多时候调用
  onMoreClick(line,tailExpandLine){
    this.setState({line:line+tailExpandLine,expand:true});
  }
  
  //点击换一换
  onChangeClick(changeCount, line, tailChangeNum, defaultLine){
    if(changeCount < tailChangeNum){
      this.setState({line:line+defaultLine,changeCount:++changeCount});
    }
  }

  addNewItem(cb){
    let {data_base} = this.state;
    let oldData = this.state.data;
    oldData.componentItem.push(data_base);
    this.setState({data:oldData});
    cb && cb();
  }
 
}

Base.displayName = 'Base';

export default Base;
