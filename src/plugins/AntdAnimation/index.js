/**
 * Created by hao.cheng on 2017/5/8.
 */
import React from "react";
import { Row, Col, Card, Table, Popconfirm, Button } from "antd";

class ExampleAnimations extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "name",
        dataIndex: "name",
        width: "30%"
      },
      {
        title: "age",
        dataIndex: "age"
      },
      {
        title: "address",
        dataIndex: "address"
      },
      {
        title: "operation",
        dataIndex: "operation",
        render: (text, record, index) => {
          return this.state.dataSource.length > 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.onDelete(record, index)}
            >
              <a>Delete</a>
            </Popconfirm>
          ) : null;
        }
      },
      {
        title: "delete",
        dataIndex: "delete",
        render: (text, record, index) => {
          return this.state.dataSource.length > 1 ? (
            <a onClick={() => this.onDelete(record, index)}>Delete</a>
          ) : null;
        }
      }
    ];
    this.state = {
      dataSource: [
        {
          key: "0",
          name: "Edward King 0",
          age: "32",
          address: "London, Park Lane no. 0"
        },
        {
          key: "1",
          name: "Edward King 1",
          age: "32",
          address: "London, Park Lane no. 1"
        }
      ],
      count: 2,
      deleteIndex: -1
    };
  }
  onDelete = (record, index) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.setState({ deleteIndex: record.key });
    setTimeout(() => {
      this.setState({ dataSource });
    }, 500);
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`
    };
    this.setState({
      dataSource: [newData, ...dataSource],
      count: count + 1
    });
  };
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div className="gutter-example">
        <Row gutter={16} type="flex" justify="center">
          <div
            style={{
              width: "100px",
              height: "100px"
            }}
          />
        </Row>
        <Row gutter={16} type="flex" justify="center">
          <Col className="gutter-row" md={14}>
            <div className="gutter-box">
              <Card bordered={false}>
                <Button
                  className="editable-add-btn mb-s"
                  onClick={this.handleAdd}
                >
                  Add
                </Button>
                <Table
                  bordered
                  dataSource={dataSource}
                  columns={columns}
                  rowClassName={(record, index) => {
                    if (this.state.deleteIndex === record.key)
                      return "animated zoomOutLeft min-black";
                    return "animated fadeInRight";
                  }}
                />
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ExampleAnimations;
