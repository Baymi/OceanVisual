import React from "react";
import {inject, observer} from "mobx-react";
import {Menu, Icon, Button} from "antd";
import Terrainmenu from "../../plugins/terrain/terrainmenu";
import Ctdmenu from "../../plugins/ctd/ctdmenu";
import Cremenu from "../../plugins/creature/cremenu";
import Tramenu from "../../plugins/track/tramenu";
import styles from "./style.css";

const SubMenu = Menu.SubMenu;
const themeIcon = "./resource/navigation/海洋副标题.png";
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
  mountPlugin: stores.config.mountPlugin, /*原有store*/
  collapsed: stores.sidemenu.collapsed, /*伸缩Menu菜单状态*/
  toggleCollapsed: stores.sidemenu.toggleCollapsed, /*伸缩Menu菜单方法*/
  terSubItem: stores.terrain.terSubItem, /*地形SubMenu*/
  ctdSubItem: stores.ctd.ctdSubItem, /*CTD数据SubMenu*/
  creSubItem: stores.creature.creSubItem, /*海洋生物SubMenu*/
  traSubItem: stores.track.traSubItem, /*科考航迹SubMenu*/
  onOpenChange: stores.sidemenu.onOpenChange, /*保证同级SubMenu只有一个展开*/
  openKeys: stores.sidemenu.openKeys
}))
@observer
class SideMenu extends React.Component {
  render() {
    const {mountPlugin, collapsed, terSubItem, ctdSubItem, creSubItem, traSubItem, openKeys} = this.props;
    let subItem = [];
    const pluginList = list.map((item, index) => {
      switch (item.id) {
        case "Terrain":
          subItem = terSubItem;
          break;
        case "CTD":
          subItem = ctdSubItem;
          break;
        case "Creature":
          subItem = creSubItem;
          break;
        case "Track":
          subItem = traSubItem;
          break;
        default:
          subItem = [];
      }
      return (
          <SubMenu
              key={index}
              children={subItem}
              onTitleClick={() => mountPlugin(item.id)}
              title={<span><Icon type="mail"/><span>{item.name}</span></span>}>
          </SubMenu>
      );
    });
    return (
        <div>
          <div className={styles.nav_container}>
            <div className={styles.title_small} id="title_small">
              <div className={styles.title_right} id="title">
                <img src={themeIcon} alt=""/>
              </div>
            </div>
            <div className={styles.title_small_bg} id="title_small_border"/>
          </div>
          <div style={{width: 256, marginTop: 80}}>
            <Button
                type="primary"
                onClick={() => this.props.toggleCollapsed()}
                style={{marginBottom: 16}}
            >
              <Icon type={collapsed ? "menu-unfold" : "menu-fold"}/>
            </Button>
            <Menu
                openKeys={openKeys}
                onOpenChange={(openKeys) => this.props.onOpenChange(openKeys)}
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
            >
              {pluginList}
            </Menu>
            <Terrainmenu/>
            <Ctdmenu/>
            <Cremenu/>
            {/*<Tramenu/>*/}
          </div>
        </div>
    );
  }
}

export default SideMenu;
