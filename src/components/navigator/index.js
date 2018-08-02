import React, { Component } from "react";
import { Radio, Row, Col } from "antd";
import { inject, observer } from "mobx-react";
import ThemePanel from "./ThemePanel";
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class Navigator extends Component {
  render() {
    return (
      <ThemePanel />
      // <Row gutter={16}>
      //   <Col span={4} push={10}>
      //     <RadioGroup value={this.props.currentPlugin} defaultValue="a">
      //       {list.map(item => (
      //         <RadioButton
      //           key={item.id}
      //           value={item.id}
      //           onClick={e => this.props.mountPlugin(e.target.value)}
      //         >
      //           {item.name}
      //         </RadioButton>
      //       ))}
      //     </RadioGroup>
      //   </Col>
      // </Row>
    );
  }
}
// onChange={e => this.props.mountPlugin(e.target.value)}
export default Navigator;
