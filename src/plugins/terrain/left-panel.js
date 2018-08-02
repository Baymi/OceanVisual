import React from "react";
import { Button, Card } from "antd";
import { inject, observer } from "mobx-react";
import QueueAnim from "rc-queue-anim";
import "./style.scss";

const { Meta } = Card;

const items = [
  {
    img: "./resource/terrain/kll2.jpg",
    name: "卡罗琳海山",
    description:
      "卡罗琳海山位于地球最深处——马里亚纳海沟南侧，此前是露出海面的岛。在水面以下600米到海山山顶，可以看到由海浪击打形成的海蚀洞现象。",
    longitude: 140.131849, // 140.14359,
    latituede: 10.500651523, // 10.5247,
    height: 0,
    heading: -0.8531,
    pitch: -0.7409,
    range: 1e5,
    layer: {
      type: "single",
      url: "./resource/terrain/kll.png",
      rec: [139.494075, 10.2679, 140.7931, 10.781297]
    }
  },
  {
    img: "./resource/terrain/mlyn.jpg",
    name: "马里亚纳海沟",
    description:
      "马里亚纳海沟，又称“马里亚纳群岛海沟”，是目前所知地球上最深的海沟，该海沟地处北太平洋西部海床，",
    longitude: 147.5869, // 140.14359,
    latituede: 15.65249, // 10.5247,
    height: 0,
    heading: -0.8531,
    pitch: -0.7409,
    range: 2e6
  },
  {
    img: "./resource/terrain/flb.jpg",
    name: "菲律宾海沟",
    description:
      "菲律宾海沟是世界第三大海沟，其最大深度为10540米,海沟深处热泉中蕴藏丰富的氦资源，具有非常高的商业价值。",
    longitude: 125.95759,
    latituede: 13.362005,
    height: 0,
    heading: -0.8531,
    pitch: -0.7409,
    range: 2e6
  }
];

@inject(stores => ({
  trackRoute: stores.terrain.trackRoute,
  navTo: stores.terrain.navTo
}))
@observer
class LeftPanel extends React.Component {
  render() {
    return (
      <QueueAnim
        className="demo-content"
        key="demo"
        type={["right", "left"]}
        ease={["easeOutQuart", "easeInOutQuart"]}
      >
        <div className="terrain-left" key="a">
          <ul>
            {items.map((item, i) => (
              <li key={i} onClick={() => this.props.navTo(item)}>
                <Card
                  hoverable
                  bordered={true}
                  cover={<img alt={item.name} src={item.img} />}
                  className="terrain-list"
                >
                  <Meta
                    className="card-Meta"
                    title={item.name}
                    description={item.description}
                  />
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </QueueAnim>
    );
  }
}

export default LeftPanel;
