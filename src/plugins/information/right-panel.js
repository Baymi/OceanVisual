import React from "react";
import { Table, Collapse, Button, Select, Divider, Card, Row, Col } from "antd";
import { inject, observer } from "mobx-react";
import ScatterChart from "./scatterChart";
import QueueAnim from "rc-queue-anim";
import styles from "./style.css";
import "./style.scss";

const columns = [{
  title: '测量参数',
  dataIndex: 'type',
  key: 'type',
}, {
  title: '测量范围',
  dataIndex: 'range',
  key: 'range',
}, {
  title: '测量准确度',
  dataIndex: 'jing',
  key: 'jing',
}];

@inject(stores => ({
  picked: stores.information.picked,
  showPanel: stores.information.showPanel
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
    var tableData = [{
      key: '1',
      type: '风速',
      range: picked.wSpeed,
      jing: picked.jing1
    }, {
      key: '2',
      type: '风向',
      range: picked.wDirection,
      jing: picked.jing2
    }, {
      key: '3',
      type: '气温',
      range: picked.temp,
      jing: picked.jing3
    }, {
      key: '4',
      type: '气压',
      range: picked.press,
      jing: picked.jing4
    }];
    var buoyName = picked.name;
    var buoyLon = picked.lon;
    var buoyLat = picked.lat;
    if(!this.props.showPanel) return null;
    return (
      
      <div className="ctd-rightup" >
      <Divider>观测参数</Divider>
        <Row>
          <Col span={8} ><div className={styles.marker}></div></Col >
          <Col span={8} >
            <Row><p className={styles.pPara}>{buoyName}</p></Row>
            <Row><p className={styles.pPara}>{buoyLon}</p></Row>
            <Row><p className={styles.pPara}>{buoyLat}</p></Row>
          </Col >
        </Row>
        <Row>
          <Table dataSource={tableData} columns={columns} pagination = {false}/>
        </Row>
        <Divider>图表显示</Divider>
        <Row>
          <ScatterChart buoyName={buoyName}/> 
        </Row>
        <br />
      </div >
    );
  }
}

export default RightPanel;
