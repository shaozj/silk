export class Tag extends React.Component{
  render(){
    let { data } = this.props;
    return data.cornerMarkId ? <span className="ui-tag"> {g_cornerMap[data.cornerMarkId+""].title} </span> : <span></span>;
  }
}

export class Score extends React.Component{
  render(){
    let { data } = this.props;
    return <span className="ui-score">X.X</span>;
  }
}

export class Img extends React.Component{
  render(){
    let { data } = this.props;
    return data.img?<img src={data.img} />:<img />;
  }
}


export const renderSummaryStrategy = (data) => {
  if(data.summaryStrategy && data.summaryStrategy == "SECONDS"){
    return <div className="tip">xx:xx</div>
  }if(data.summaryStrategy && data.summaryStrategy == "SCORE"){
    return <span className="score"><u>x</u><s>.x</s></span>
  }if(data.summaryStrategy && data.summaryStrategy == "UPDATE_STATUS"){
    return <div className="tip">更新至xx集</div>
  }else if(data.summaryStrategy && data.summaryStrategy == "PUBLISH_TIME"){
    let now = new Date().getTime();
    if(now - data.videoReleaseTime>0){
      if(now - data.videoReleaseTime < 1000* 60*60){
        let time = new Date(1494474642000);
        let h = time.getHours();
        let m = time.getMinutes();
        return <div className="ui-tip">{`${h}:${m}发布`}</div>
      }else{
        let range = now - data.videoReleaseTime;
        let h = parseInt(range/(1000*60*60));
        return <div className="ui-tip">{`${h}小时前发布`}</div>
      }
    }
  }else{
    return <div className="ui-tip">{data.summary}</div>
  }
}

export class Summary extends React.Component{
  render(){
    let { data } = this.props;
    let dom = renderSummaryStrategy(data);
    return dom
  }
}

export const renderPlayNumOrSubTitile = (data) =>{
  if(data.subtitleStrategy && data.subtitleStrategy=="PLAY_VV"){
    return <div className="ui-more">x.x万次</div>
  }else{
    return <div className="ui-sub-title">{data.subtitle}</div>
  }
}

export class SubTitle extends React.Component{
  render(){
    let { data } = this.props;
    let dom = renderPlayNumOrSubTitile(data);
    return dom
  }
}

export class Title extends React.Component{
  render(){
    let { data } = this.props;
    return <div className="ui-title">{data.title}</div>
  }
}

export class Item extends React.Component{
  constructor(props) {
    super(props);
  }
  render(){
    let { data, coverLay, coverLayPos, index, href, env } = this.props;
    let fromGroup =( data && data.fromGroup) || -1;
    return (
        href && href!=="" ?
          <a className="ui-item" href={href} data-from={fromGroup}>
            {this.props.children}
            {coverLay && env==="admin" && coverLay(coverLayPos)}
          </a>:
          <div className="ui-item" data-from={fromGroup}>
            {this.props.children}
            {coverLay && env==="admin" && coverLay(coverLayPos)}
          </div>
    )
  }
}
