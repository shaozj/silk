import './index.less';
import ProgramList from 'components/ProgramList/ProgramList.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }

  componentDidMount() {
    
  }

  render(){
    return (
        <div className="program-list-wrap">
          <ProgramList />
        </div>
    );
  }
}

ReactDOM.render (<App />, document.getElementById('app'));
