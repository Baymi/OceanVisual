import React from "react";
import LeftPanel from "./left-panel";
import RightPanel from "./right-panel";

class Terrain extends React.Component {
  static InitialState = {
    terrain: {
      enableWater: true,
    }
  };
  render() {
    return (
      <div>
        {/*<LeftPanel />*/}
        <RightPanel> </RightPanel>
      </div>
    );
  }
}

export default Terrain;
