import React from "react";
import { Table, Collapse, Button, Select, Divider, Card, Row, Col } from "antd";
import { inject, observer } from "mobx-react";
import ScatterChart from "./scatterChart";
import QueueAnim from "rc-queue-anim";
import styles from "./style.css";
const { Meta } = Card;

const column = [
  {
    title: "测量参数",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "测量范围",
    dataIndex: "range",
    key: "range"
  }
];

@inject(stores => ({
  picked: stores.information.picked
}))
@observer
class RightPanel extends React.Component {
  componentDidMount() {
    // this.props.init();
  }
  componentWillUnmount() {
    // this.props.unmount()
  }
  render() {
    const { picked } = this.props;
    var tableLeft = [
      {
        key: "1",
        type: "IMO:",
        range: "9263215"
      },
      {
        key: "2",
        type: "船籍:",
        range: "福建"
      },
      {
        key: "3",
        type: "状态:",
        range: "在航（主机推动）"
      },
      {
        key: "4",
        type: "任务:",
        range: "采集信息"
      }
    ];

    var tableRight = [
      {
        key: "1",
        type: "船长:",
        range: "333m"
      },
      {
        key: "2",
        type: "船宽:",
        range: "60m"
      },
      {
        key: "3",
        type: "吃水:",
        range: "11.6m"
      },
      {
        key: "4",
        type: "启航:",
        range: "2018-6-26"
      }
    ];
    var buoyName = picked.name;
    var buoyLon = picked.lon;
    var buoyLat = picked.lat;
    if (buoyName === "") return null;
    return (
      <div
        id="track-panel"
        style={{ display: "none", width: "440px" }}
        className="ctd-rightup"
      >
        <Divider>船只参数</Divider>
        <Card
          hoverable
          bordered={true}
          cover={<img src="./resource/trackShip.jpg" />}
        >
          <Meta style={{ fontSize: "14px" }} title="夕阳红03号" />
        </Card>
        <Row>
          <Col span={12}>
            <Table
              dataSource={tableLeft}
              columns={column}
              showHeader={false}
              pagination={false}
            />
          </Col>
          <Col span={12}>
            <Table
              dataSource={tableRight}
              columns={column}
              showHeader={false}
              pagination={false}
            />
          </Col>
        </Row>
        <Divider>图表显示</Divider>
        <Row>
          <ScatterChart buoyName={buoyName} />
        </Row>
        <br />
      </div>
    );
  }
}

export default RightPanel;
