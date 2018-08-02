import React from "react";
import { inject, observer } from "mobx-react";
import Leftpanel from "./left-panel";
import Rightpanel from "./right-panel";

@inject(stores => ({
  toggleClock: stores.track.toggleClock,
  minTime: stores.track.minTime,
  maxTime: stores.track.maxTime,
  currentTime: stores.track.currentTime,
  changeTime: stores.track.changeTime,
  play: stores.track.play,
  timelineVisible: stores.track.timelineVisible
}))
@observer
class Creature extends React.Component {
  static InitialState = {
    terrain: {
      currentLayer: "img",
      enableTerrain: true,
      enableWater: true,
      enableTerrainWater: false,
      landScale: 2,
      oceanScale: 5
    }
  };
  render() {
    const stores = this.props;
    return (
      <div>
        {/*<Leftpanel />*/}
        <Rightpanel />
      </div>
    );
  }
}

export default Creature;
