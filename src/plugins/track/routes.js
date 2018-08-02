import React from "react";
import { Button, Divider, Card } from "antd";
import { inject, observer } from "mobx-react";
import QueueAnim from "rc-queue-anim";
import styles from "./style.css";

const { Meta } = Card;

@inject(stores => ({
  init: stores.track.init,
  routeList: stores.track.routeList,
  loadRoute: stores.track.loadRoute,
  unmount: stores.track.unmount
}))
@observer
class Routes extends React.Component {
  componentDidMount() {
    this.props.init();
  }
  componentWillUnmount() {
    this.props.unmount()
  }
  render() {
    const { routeList, loadRoute } = this.props;
    return (
      <QueueAnim
        className="demo-content"
        key="demo"
        type={["right", "left"]}
        ease={["easeOutQuart", "easeInOutQuart"]}
      >
        <div className={styles.routes} key="a">
        <Divider>海洋专项调查航次信息展示</Divider>
          <ul>
            {routeList.map((item, i) => (
              <div>
                <li key={item.id} onClick={() => loadRoute(item.id)}>
                  <div className={styles.liDiv}> {`>> ${item.name}`}</div>
                </li>
              </div>
            ))}
          </ul>
        </div>
      </QueueAnim>
    );
  }
}

export default Routes;
