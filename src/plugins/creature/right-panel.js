import React from "react";
import { Collapse, Button, Select, Divider, Card, Row, Col } from "antd";
import { inject, observer } from "mobx-react";
import QueueAnim from "rc-queue-anim";
import styles from "./style.css";
import "./style.scss";

const { Meta } = Card;
const Option = Select.Option;
const Panel = Collapse.Panel;

@inject(stores => ({
  // toggleType: stores.creature.toggleType,
  picked: stores.creature.picked
  // typeData: stores.creature.typeData,
  // modelId: stores.creature.modelId
  // unmount: stores.creature.unmount
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
    const {picked} = this.props;
    return (
      <div id="creaturePanel" className="creaturePanel" >
        <Collapse defaultActiveKey={["1","2"]} >
          <Panel header="物体图片" key="1">
            <Card
              hoverable
              bordered={true}
              cover={
                <img
                  src={picked.titleUrl}
                />
              }
            >
              <Meta className={styles.titleMeta} style = {{ fontSize: "14px" }} title={picked.title} />
            </Card>
            <Card
              hoverable
              bordered={true}
              cover={
                <img
                  src={picked.subUrl}
                />
              }
            >
              <Meta className={styles.titleMeta} style = {{ fontSize: "14px" }} title={picked.sub} />
            </Card >
          </Panel>
          <Panel header="物体描述" key="2">
            <Meta description={picked.collect} />
            <Meta description={picked.des} />
          </Panel>
        </Collapse>
      </div >
    );
  }
}

export default RightPanel;
