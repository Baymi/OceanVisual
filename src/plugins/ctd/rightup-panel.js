import React from "react";
import { inject, observer } from "mobx-react";
import {
  Divider,
  Select,
  Radio,
  Row,
  Col,
  Switch,
  Slider,
  Dropdown,
  Button,
  InputNumber,
  Menu
} from "antd";
import styles from "./styles.css";

const Option = Select.Option;

@inject(stores => ({
  toggleType: stores.ctd.toggleType,
  toggleRectangle: stores.ctd.toggleRectangle,
  toggleLine: stores.ctd.toggleLine,
  toggleDepth: stores.ctd.toggleDepth,
  toggleReset: stores.ctd.toggleReset
}))
@observer

// function handleChange(value) {
//   console.log(`selected ${value}`);
// }
class RightupPanel extends React.Component {
  render() {
    return (
      <div className="ctd-rightup">
        <Divider>CTD数据选择</Divider>
        <Row>
          <Col span={8} />
          <Col span={8}>
            <Select
              defaultValue="prdm"
              onChange={val => this.props.toggleType(val)}
            >
              <Option value="prdm">水压</Option>
              <Option value="potemp">温度</Option>
              <Option value="sal00">盐度</Option>
              <Option value="sigma0">密度1</Option>
              <Option value="sigmat00">密度2</Option>
              <Option value="sbeox">含氧量</Option>
            </Select>
          </Col>
        </Row>
        <Divider>数据划分</Divider>
        <Row>
          <Col span={12}>
            <Row>
              <div style={{ marginTop: "7px", marginLeft: "35px" }}>
                <Button type="primary" onClick={() => this.props.toggleLine()}>
                  剖面拾取
                </Button>
              </div>
            </Row>
            <Row>
              <div
                style={{
                  marginTop: "7px",
                  marginLeft: "35px",
                  marginBottom: "20px"
                }}
              >
                <Button
                  type="primary"
                  onClick={() => this.props.toggleRectangle()}
                >
                  框选
                </Button>
              </div>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={10}>
                <div
                  style={{
                    color: "#fff",
                    marginTop: "7px",
                    marginLeft: "10px"
                  }}
                >
                  层位拾取
                </div>
              </Col>
              <Col span={8}>
                <Button onClick={() => this.props.toggleReset()}>重置</Button>
              </Col>
            </Row>
            <Row>
              <Slider
                // vertical="true"
                min={0}
                max={10}
                onChange={val => this.props.toggleDepth(val)}
                // value={this.state.inputValue}
              />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RightupPanel;
/**
 * ----底图选择---
 * 地形图、卫星影像、全球地图
 * ---更多配置
 * 地形开关 toggle
 * 海面覆盖效果 toggle
 * 陆地倍率
 * 海底倍率
 */
