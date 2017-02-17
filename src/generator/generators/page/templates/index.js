import style from './index<%= style.suffix %>';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }

  render(){
    return (
      <div className={style.<%= style.camelClassName %>}>
      
      </div>
    );
  }
}

ReactDOM.render (<App />, document.getElementById('app'));
