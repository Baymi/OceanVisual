import React from "react";
import { inject, observer } from "mobx-react";
import Routes from "./routes";
import Panel from "./panel";
import Timeline from "../../components/timeline";

@inject(stores => ({
  toggleClock: stores.track.toggleClock,
  minTime: stores.track.minTime,
  maxTime: stores.track.maxTime,
  currentTime: stores.track.currentTime,
  changeTime: stores.track.changeTime,
  play: stores.track.play,
  timelineVisible: stores.track.timelineVisible,
  toggleTransparent: stores.terrain.timelineVisible
}))
@observer
class Terrain extends React.Component {
  static InitialState = {
    terrain: {
      currentLayer: "img",
      enableTerrain: true,
      enableWater: false,
      enableTerrainWater: true,
      landScale: 1,
      oceanScale: 1
    }
  };

  render() {
    const stores = this.props;
    return (
      <div>
        <Routes />
        {this.props.timelineVisible&&<Panel />}
        <Timeline {...stores} />
      </div>
    );
  }
}

export default Terrain;
