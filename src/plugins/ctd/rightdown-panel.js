import React from "react";
import { Row, Col, Collapse, Radio, Card, Table, Divider } from "antd";
import { inject, observer } from "mobx-react";
// import QueueAnim from "rc-queue-anim";
import TideChart from "./tideChart";
import TideupChart from "./tideupChart";
import TidedownChart from "./tidedownChart";
import "./style.scss";
import styles from "./styles.css";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Meta } = Card;
const Panel = Collapse.Panel;

const list = [
  {
    type: "tide",
    title: "潮汐曲线"
  },
  {
    type: "weather",
    title: "天气指数"
  },
  {
    type: "visible",
    title: "能见度曲线"
  }
];

const columns = [
  {
    title: "Type",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Value",
    dataIndex: "age",
    key: "age"
  }
];

@inject(stores => ({
  picked: stores.ctd.picked,
  toggleMonitor: stores.ctd.toggleMonitor,
  monitorType: stores.ctd.monitorType,
  stationId: stores.ctd.stationId,
  tideId: stores.ctd.tideId
}))
@observer
class RightdownPanel extends React.Component {
  render() {
    const { picked, tideId } = this.props;
    const tableData = [
      {
        key: "1",
        name: "水质等级",
        age: picked.waterL
      },
      {
        key: "2",
        name: "海流情况",
        age: picked.currentL
      },
      {
        key: "3",
        name: "主要元素",
        age: picked.elementL
      },
      {
        key: "4",
        name: "主要生物",
        age: picked.creatureL
      }
    ];

    return (
      <div>
        <div id="tideContainer" style={{ display: "none" }}>
          <Collapse defaultActiveKey={["1", "2"]} className="ctd-rightdown">
            <Panel header="监测数据" key="1">
              <RadioGroup className={styles.radioGroup}>
                <Row justify={"center"}>
                  {list.map(item => (
                    <Col span={8} key={item.type}>
                      <RadioButton
                        onClick={e => this.props.toggleMonitor(e.target.value)}
                        value={item.type}
                      >
                        {item.title}
                      </RadioButton>
                    </Col>
                  ))}
                </Row>
              </RadioGroup>
              <Row>
                <TideChart monitorType={this.props.monitorType} />
              </Row>
            </Panel>
            <Panel header="潮汐时间统计" key="2">
              <Row>
                <Col span={12}>
                  <TideupChart tideId={tideId} />
                </Col>
                <Col span={12}>
                  <TidedownChart tideId={tideId} />
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </div>
        <div id="stationContainer" style={{ display: "none" }}>
          <Collapse defaultActiveKey={["1"]} className="ctd-rightdown">
            <Panel header="监测基站统计" key="1">
              <Card
                hoverable
                bordered
                cover={<img alt={picked.name} src={picked.imageUrl} />}
              >
                <Meta title={picked.name} />
                <Table
                  columns={columns}
                  dataSource={tableData}
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  }
}

export default RightdownPanel;
