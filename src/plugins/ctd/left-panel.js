import React from "react";
import { Collapse, Row, Col } from "antd";
import { inject, observer } from "mobx-react";
// import QueueAnim from "rc-queue-anim";
import BarglChart from "./barglChart";
import SeafloorChart from "./seafloorChart";
import "./style.scss";
import styles from "./styles.css";

const Panel = Collapse.Panel;
@inject(stores => ({
  chartdata: stores.ctd.chartData,
  jLength: stores.ctd.jLength
}))
@observer
class LeftPanel extends React.Component {
  render() {
    return (
      <div id="ctdLeft" className="ctd-left" style={{ display: "none" }}>
        <Collapse
          id="ctdLeftco"
          defaultActiveKey={["1", "2"]}
          className="antd-collapse"
        >
          <Panel header="剖面层值" key="1">
            <BarglChart chartdata={this.props.chartdata} />
          </Panel>
          <Panel header="剖面地形" key="2">
            <SeafloorChart jLength={this.props.jLength} />
          </Panel>
        </Collapse>
        <div style={{ marginTop: "20px" }}>
          <Row>
            <Col span={4}>
              <div className={styles.stationMarker} />
            </Col>
            <Col span={8}>
              <div className={styles.markerP}>海洋环境监测站</div>
            </Col>
            <Col span={4}>
              <div className={styles.tideMarker} />
            </Col>
            <Col span={8}>
              <div className={styles.markerP}>潮汐监测站</div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default LeftPanel;
