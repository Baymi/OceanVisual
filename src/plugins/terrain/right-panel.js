import React from "react";
import { inject, observer } from "mobx-react";
import {
  Divider,
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
import styles from "./style.css";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const list = [
  {
    type: "img",
    img: "./resource/thumbnail/img.jpg",
    title: "全球影像"
  },
  {
    type: "map",
    img: "./resource/thumbnail/map.jpg",
    title: "全球地图"
  },
  {
    type: "terrain",
    img: "./resource/thumbnail/terrain.jpg",
    title: "全球地形"
  }
];

@inject(stores => ({
  toggleBaseLayer: stores.terrain.toggleBaseLayer,
  toggleWater: stores.terrain.toggleWater,
  toggleTerrain: stores.terrain.toggleTerrain,
  currentLayer: stores.terrain.currentLayer,
  enableTerrain: stores.terrain.enableTerrain,
  enableWater: stores.terrain.enableWater,
  changeScale: stores.terrain.changeScale,
  landScale: stores.terrain.landScale,
  oceanScale: stores.terrain.oceanScale
}))
@observer
class RightPanel extends React.Component {
  // constructor(){
  //   this.props.toggleTerrain
  // }
  componentDidMount() {
    setTimeout(() => this.props.toggleTerrain(true), 100);
  }
  render() {
    const {
      toggleBaseLayer,
      toggleWater,
      toggleTerrain,
      currentLayer,
      enableTerrain,
      enableWater,
      changeScale,
      landScale,
      oceanScale
    } = this.props;
    return (
      <div className="terrain-right">
        <Divider>地图选择</Divider>
        <div className={styles.cardList}>
          <RadioGroup value={currentLayer} defaultValue="a">
            <Row gutter={4} justify={"center"}>
              {list.map(item => (
                <Col span={8} key={item.type}>
                  <RadioButton
                    onClick={e => {
                      toggleBaseLayer(e.target.value);
                      // toggleTerrain(true);
                    }}
                    value={item.type}
                  >
                    {item.title}
                  </RadioButton>
                </Col>
              ))}
            </Row>
          </RadioGroup>
          <Divider>地形配置</Divider>
          <div justify={"space-between"}>
            <span className="terrain-p">地形开关</span>
            <Switch
              checked={enableTerrain}
              onChange={val => toggleTerrain(val)}
            />
          </div>
          <div justify={"space-between"}>
            <span className="terrain-p">海水覆盖</span>
            <Switch checked={enableWater} onChange={toggleWater} />
          </div>
          <Row>
            <Col span={24}>
              <span className="terrain-p">陆地倍率</span>
            </Col>
            <Col span={12}>
              <Slider
                min={1}
                max={20}
                value={this.props.landScale}
                step={1}
                // marks={{ 1: 1, 5: 5, 10: 10, 15: 15, 20: 20 }}
                onChange={val => changeScale({ landScale: val })}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={1}
                max={20}
                style={{ marginLeft: 16 }}
                value={this.props.landScale}
                onChange={val => changeScale({ landScale: val })}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <span className="terrain-p">海洋倍率</span>
            </Col>
            <Col span={12}>
              <Slider
                min={1}
                max={20}
                value={this.props.oceanScale}
                onChange={val => changeScale({ oceanScale: val })}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={1}
                max={20}
                style={{ marginLeft: 16 }}
                value={this.props.oceanScale}
                onChange={val => changeScale({ oceanScale: val })}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default RightPanel;
/**
 * ----底图选择---
 * 地形图、卫星影像、全球地图
 * ---更多配置
 * 地形开关 toggle
 * 海面覆盖效果 toggle
 * 陆地倍率
 * 海底倍率
 */
