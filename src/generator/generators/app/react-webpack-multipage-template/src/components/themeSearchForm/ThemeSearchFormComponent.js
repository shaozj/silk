import { Form, Row, Col, Input, Button, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class AdvancedSearchForm extends React.Component {
  state = {
    expand: false
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      console.log('do submit get data');
      //ajax
      let data = ['searchdata'];
      this.props.componentWillMount(data);
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }
  renderOption = (data) => {
     let arr = [];
     data.map((v,k) => {
        arr.push(<Option value={v.value} key={k}>{v.key}</Option>);
     });
     return arr;
  }
  componentWillMount(){
    this.setState({"componentWillMount":this.props.componentWillMount});
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };

    // To generate mock Form.Item
    const children = [];
    let labels = [
      {
        "label":"主题ID:",
        "placeholder":"主题ID"
      },
      {
        "label":"主题名称：",
        "placeholder":"主题名称"
      },
      {
        "label":"数据类型：",
        "placeholder":"数据类型",
        "subTree":[
            {
              "key":"默认",
              "value":"0"
            },
            {
              "key":"节目",
              "value":"1"
            },
            {
              "key":"专题",
              "value":"2"
            }
        ]
      },
      {
        "label":"主题来源：",
        "placeholder":"主题来源",
        "subTree":[
            {
              "key":"默认全部",
              "value":"0"
            },
            {
              "key":"运营自建",
              "value":"1"
            },
            {
              "key":"算法生成",
              "value":"2"
            },
            {
              "key":"专题转化",
              "value":"3"
            }
        ]
      },
      {
        "label":"对应专题：",
        "placeholder":"对应专题",
        "subTree":[
            {
              "key":"默认全部",
              "value":"0"
            },
            {
              "key":"有",
              "value":"1"
            },
            {
              "key":"无",
              "value":"2"
            }
        ]
      },
      {
        "label":"专题ID：",
        "placeholder":"专题ID"
      },
      {
        "label":"专题名称：",
        "placeholder":"专题名称"
      }
    ];
    
    for (let i = 0; i < 7; i++) {
      children.push(
        <Col span={8} key={i}>
          <FormItem {...formItemLayout} label={labels[i].label}>
            { labels[i].subTree ?
                getFieldDecorator(
                `field-${i}`, {
                  initialValue: labels[i].subTree[0].value
                })(
                  <Select>
                  {this.renderOption(labels[i].subTree)}
                  </Select>
                ):
                getFieldDecorator(`field-${i}`)(<Input placeholder={labels[i].placeholder} />)
            }
          </FormItem>
        </Col>
      );
    }

    const expand = this.state.expand;
    const shownCount = expand ? children.length : 8;
    return (
      <Form
        horizontal
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>
          {children.slice(0, shownCount)}
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
            <a style={{ marginLeft: 18, fontSize: 12 }} href="/build/program-list.html">
              新建运营主题
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}



export default AdvancedSearchForm;
