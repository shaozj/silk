import './App.less';

class <%= component.className %> extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }

  render(){
    return (
      <div className="<%= style.className %>">

      </div>
    );
  }
}

export default <%= component.className %>;
