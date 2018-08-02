import React from "react";
import { inject, observer } from "mobx-react";
import Leftpanel from "./left-panel";
import Rightpanel from "./right-panel";

@inject(stores => ({
}))
@observer
class Information extends React.Component {
  static InitialState = {
    terrain: {
      // currentLayer: "img",
      // enableTerrain: true,
      // enableWater: false,
      // enableTerrainWater: true,
      // landScale: 1,
      // oceanScale: 1
    }
  };
  render() {
    const stores = this.props;
    return (
      <div>
        <Leftpanel />
        <Rightpanel />
      </div>
    );
  }
}

export default Information;
