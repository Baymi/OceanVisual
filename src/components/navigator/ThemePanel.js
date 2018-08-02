import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";

import styles from "./style.css";

const themeIcon = "./resource/navigation/海洋副标题.png"
const list = [
  {
    id: "Terrain",
    name: "海底地形"
  },
  {
    id: "CTD",
    name: "近海观测"
  },
  {
    id: "Creature",
    name: "海洋生物"
  },
  {
    id: "Information",
    name: "开放数据"
  },
  {
    id: "Track",
    name: "科考航迹"
  }
];
@inject(stores => ({
  currentPlugin: stores.config.currentPlugin,
  mountPlugin: stores.config.mountPlugin
}))
@observer
class ThemePanel extends React.Component {
  render() {
    const { currentPlugin, mountPlugin } = this.props;
    console.log(currentPlugin)
    const pluginList = list.map((item, index) => {
      const block =
        item.id === currentPlugin ? <div className={styles.block} /> : null;
      const bg =
        item.id === currentPlugin ? styles.listSpanGradient : styles.listSpan;
      // const bg = item.id === plugin ? <div className={styles.bg} /> : null;
      return (
        <li key={index} onClick={() => mountPlugin(item.id)}>
          <div className={styles.bg}>
            {block}
            <span className={bg}>{item.name}</span>
          </div>
        </li>
      );
    });
    return (
      <div className={styles.nav_container}>
        <div className={styles.title_small} id="title_small">
          <div className={styles.title_right} id="title">
            <img src={themeIcon} alt="" />
          </div>
          <ul>{pluginList}</ul>
        </div>
        <div className={styles.title_small_bg} id="title_small_border" />
      </div>
    );
  }
}
// ThemePanel.propTypes = {
//   currentPlugin: PropTypes.string.isRequired,
//   mountPlugin: PropTypes.func.isRequired
// };

export default ThemePanel;
