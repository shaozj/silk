import React from 'react';
import { Spin, message } from 'antd';
import SearchForm from './SearchForm/SearchForm';
import MyTable from './MyTable/MyTable';
import Description from './Chart/Description';
import Fetcher from './Fetcher';

export default class Page extends React.PureComponent {
  constructor(props) {
    super(props);
    //搜索框的数据
    this.state = {
      data: [],
      searchData:{}
    };
    // 搜索页搜索出来的用于表格显示的数据
  }

  /**
   *首次搜索一下
   */
  componentDidMount(){
   //this.onSearchFormSubmit({});
  }

  /**
   * 将我们的搜索框里面的数据保存，并访问接口得到新数据更新表格
   */
  onSearchFormSubmit = data => {
    Fetcher.getList(data).then(res => {
      if (res.success) {
        this.setState({
          data: res.data,
          searchData:data
        });
      } else {
        message.error('搜索项目出错' + res.message);
        this.setState({
          data: [],
          searchData:{}
        });
      }
    });
  }

  render() {
    const { searchData } = this.state;
    return (
      <div>
        <div className="box">
          <SearchForm onSearch={this.onSearchFormSubmit} />
        </div>
        <Description searchData={searchData}/>
        <div className="box">
          <Spin spinning={false}>
            <MyTable
              data={this.state.data}
            />
          </Spin>
        </div>
      </div>
    );
  }
}
