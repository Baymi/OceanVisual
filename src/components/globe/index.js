import React from "react";
import PropTypes from "prop-types";

import style from "./Globe.css";

const { Earth } = GeoVis;
class Globe extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }

  componentDidMount() {
    this.createEarth();
  }

  createEarth() {
    this.earth = new Earth("GeoVisContainer");
    this.earth.scene.backgroundColor = GeoVis.Color.BLACK;
    window.earth = this.earth;
    // this.earth.scene.backgroundColor = new GeoVis.Color(
    //   0.1,
    //   0.1,
    //   0.1
    // ).withAlpha(0.7);
    // new SingleLayer("./resource/share/earth.jpg").addTo(this.earth.layers);
    this.earth.once("tick", () => {
      setTimeout(()=>{
        this.earth.handleResize();
      }, 100);
    });
    this.props.onComplete(this.earth);
  }

  render() {
    return <div id="GeoVisContainer" className={style.fullSize} />;
  }
}

Globe.propTypes = {
  onComplete: PropTypes.func.isRequired
};

export default Globe;
