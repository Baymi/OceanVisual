import React from "react";
import { Button, Select, Cascader, Divider, Card, Row, Col } from "antd";
import { inject, observer } from "mobx-react";
import QueueAnim from "rc-queue-anim";
import styles from "./style.css";

const { Meta } = Card;
const Option = Select.Option;
const option1 = [{
  value: 'volcano',
  label: '海底火山',
}, {
  value: 'platform',
  label: '海上平台',
}, {
  value: 'coralreef',
  label: '珊瑚礁',
}, {
  value: 'porrock',
  label: '玄武岩',
}, {
  value: 'flatrock',
  label: '沉积岩',
}, {
  value: 'island',
  label: '海岛',
}, {
  value: 'ship',
  label: '船只',
  children: [{
    value: 'shenqianhao',
    label: '深潜号',
  }, {
    value: 'fisher',
    label: '渔船',
  }, {
    value: 'ship',
    label: '小船',
  }, {
    value: 'freighter',
    label: '货轮',
  }]
}];

const option2 = [{
  value: 'whale',
  label: '鲸鱼',
}, {
  value: 'shark',
  label: '鲨鱼',
}, {
  value: 'dolphin',
  label: '海豚',
}, {
  value: 'fish',
  label: '鱼类',
  children: [{
    value: 'tropical',
    label: '热带鱼',
  }, {
    value: 'clown',
    label: '小丑鱼',
  }, {
    value: 'manta',
    label: '蝠鲼',
  }]
}]

const option3 = [{
  value: 'crab',
  label: '帝王蟹',
}, {
  value: 'sponge',
  label: '海绵',
}, {
  value: 'seaurchin',
  label: '海胆',
}]

const option4 = [{
  value: 'seaweed',
  label: '海草',
}, {
  value: 'redforest',
  label: '红树植物',
}]

@inject(stores => ({
  toggleType: stores.creature.toggleType,
  unmount: stores.creature.unmount
}))
@observer
class LeftPanel extends React.Component {
  componentDidMount() {
    // this.props.init();
  }
  componentWillUnmount() {
    this.props.unmount()
  }
  render() {
    return (
      <div className="leftPanel300">
        <Divider>海洋场景</Divider>
        <Row>
          <Col span={8} />
          <Col span={8}>
            <Cascader
              options={option1}
              onChange={val => this.props.toggleType(val)}
              placeholder="请选择"
            />
          </Col>
        </Row>
        <Divider>游泳生物</Divider>
        <Row>
          <Col span={8} />
          <Col span={8}>
            <Cascader
              options={option2}
              onChange={val => this.props.toggleType(val)}
              placeholder="请选择"
            />
          </Col>
        </Row>
        <Divider>底栖生物</Divider>
        <Row>
          <Col span={8} />
          <Col span={8}>
            <Cascader
              options={option3}
              onChange={val => this.props.toggleType(val)}
              placeholder="请选择"
            />
          </Col>
        </Row>
        <Divider>海洋植物</Divider>
        <Row>
          <Col span={8} />
          <Col span={8}>
            <Cascader
              options={option4}
              onChange={val => this.props.toggleType(val)}
              placeholder="请选择"
            />
          </Col>
        </Row>
        <Divider></Divider>
      </div >
    );
  }
}

export default LeftPanel;
