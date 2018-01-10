import styles from './ExposeNumber.less';

export default class ExposeNumber extends React.Component {
  state = {
   data:{}
  }

  componentDidMount(){}

  componentWillReceiveProps(){}

  render() {
    return <div>
        <p className={ styles.projectName }>项目名称:{ this.state.data.projectName||'无项目' }</p>
        <p className={ styles.projectName }>项目描述:{ this.state.data.projectDesc||'无项目' }</p>
        <div className={ styles.number }>
            <p className={ styles.text }>项目总曝光量</p>
            <p className={ styles.count }>{ this.state.data.exposureNum || '0' }</p>
        </div>
    </div>;
  }
}
