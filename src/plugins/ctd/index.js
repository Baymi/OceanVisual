import React from "react";
import { inject, observer } from "mobx-react";
import LeftPanel from "./left-panel";
import RightupPanel from "./rightup-panel";
import RightdownPanel from "./rightdown-panel";
import "./style.scss";

@inject(stores => ({
  unmount: stores.ctd.unmount
}))
@observer
class CtdComp extends React.Component {
  static InitialState = {
    terrain: {
      currentLayer: "img",
      // enableTerrain: true,
      // enableWater: false,
      // enableTerrainWater: true,
      // landScale: 1,
      // oceanScale: 1
    }
  };

  componentDidMount() {
    // this.props.init();
  }

  componentWillUnmount(){
    this.props.unmount()
  }

  render() {
    return (
      <div>
        <LeftPanel />
        <RightupPanel />
        <RightdownPanel />
      </div>
    );
  }
}

export default CtdComp;
