import React from "react";
import {Menu, Divider, Card} from "antd";
import {inject, observer} from "mobx-react";
import QueueAnim from "rc-queue-anim";
import styles from "./style.css";

const {Meta} = Card;

@inject(stores => ({
  init: stores.track.init,
  routeList: stores.track.routeList,
  loadRoute: stores.track.loadRoute,
  unmount: stores.track.unmount,
  traSubItem: stores.track.traSubItem
}))
@observer
class Tramenu extends React.Component {
  componentDidMount() {
    this.props.init();
  }

  componentWillUnmount() {
    this.props.unmount();
  }

  render() {
    const {routeList, loadRoute, traSubItem} = this.props;
    routeList.map((item, i) => {
      traSubItem.push(<Menu.Item key={item.id} onClick={() => loadRoute(item.id)}>{item.name}</Menu.Item>);
    });
    return (
        <div></div>
    );
  }
}

export default Tramenu;
