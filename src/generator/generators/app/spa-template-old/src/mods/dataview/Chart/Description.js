import ExposeNumber from './ExposeNumber';
import HistogramView from './HistogramView';
import { Row, Col } from 'antd';
import styles from './Description.less';

export default class Description extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <Row>
          <Col span={8} >
            <ExposeNumber searchData={this.props.searchData}/>
          </Col>
          <Col span={14}>
            <HistogramView searchData={this.props.searchData}/>
          </Col>
        </Row>
      </div>
    );
  }
}
