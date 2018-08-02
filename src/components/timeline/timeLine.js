import React, { Component } from "react";
import styles from "./timeLine.css";

class TimeLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      begin: "./resource/timeline/zant.png"
    };
  }
  tabImg() {
    if (this.state.begin === "./resource/timeline/bobo.png") {
      this.setState({ begin: "./resource/timeline/zant.png" });
    } else {
      this.setState({ begin: "./resource/timeline/bobo.png" });
    }
  }
  render() {
    const { minTime, maxTime, currentTime, timelineVisible, play } = this.props;
    const playBtn = play ? "./resource/timeline/zant.png" : "./resource/timeline/bobo.png";
    const minStr = new Date(minTime).toDateString();
    const maxStr = new Date(maxTime).toDateString();
    const currentStr = new Date(currentTime).toDateString();
    return (
      <div
        className={`${styles["time-line"]} ${
          timelineVisible ? "" : styles["time-unvisible"]
        }`}
      >
        <div className={styles["beginBtn-wrap"]}>
          <img
            className={styles["beginBtn"]}
            onMouseDown={this.tabImg.bind(this)}
            onClick={this.props.toggleClock}
            src={playBtn}
          />
        </div>
        <span>{minStr}</span>
        <div className={styles["center-main"]}>
          <input
            className="range"
            type="range"
            value={this.props.currentTime}
            max={this.props.maxTime}
            min={this.props.minTime}
            onInput={this.props.changeTime}
          />
          <p className={styles["now-nowVal"]}>{currentStr}</p>
        </div>
        <span className={styles["fr"]}>{maxStr}</span>
      </div>
    );
  }
}
export default TimeLine;
