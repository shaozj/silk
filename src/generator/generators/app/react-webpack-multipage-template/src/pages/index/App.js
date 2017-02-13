import './App.less';

import AdvancedSearchForm from 'components/themeSearchForm/ThemeSearchFormComponent.js';
import ThemeSearchListComponent from 'components/themeSearchList/ThemeSearchListComponent.js';
import {Form} from 'antd';


class ThemePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }
  onFormDataCallback(data){
    this.setState({data:data});
  }
  render(){
    let WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);
    return (
        <div>
            <div className="box box-primary">
              <div className="title">运营主题库管理</div>
              <div className="box-body">
                <WrappedAdvancedSearchForm onSubmitCallback={this.onFormDataCallback}/>
                <div className="table-list">
                  <ThemeSearchListComponent data={this.state.data}/>
                </div>
              </div>
            </div>
        </div>
    );
  }
}

export default ThemePage;
