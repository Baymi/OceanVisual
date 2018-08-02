import React from "react";
import {Menu} from "antd";
import {inject, observer} from "mobx-react";

const items = [
  {
    key: "prdm",
    name: "水压"
  },
  {
    key: "potemp",
    name: "温度"
  },
  {
    key: "sal00",
    name: "盐度"
  },
  {
    key: "sigma0",
    name: "密度1"
  },
  {
    key: "sigmat00",
    name: "密度2"
  },
  {
    key: "sbeox",
    name: "含氧量"
  }
];

@inject(stores => ({
  ctdSubItem: stores.ctd.ctdSubItem,
  toggleType: stores.ctd.toggleType
}))
@observer
class Ctdmenu extends React.Component {
  render() {
    const {ctdSubItem} = this.props;
    items.map((item) => {
      ctdSubItem.push(<Menu.Item key={item.key} onClick={() => this.props.toggleType(item.key)}>{item.name}</Menu.Item>);
    });
    return (
      <div></div>
    );
  }
}

export default Ctdmenu;
