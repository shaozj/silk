import './index.less';

class App extends React.Component {
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

ReactDOM.render (<App />, document.getElementById('app'));
