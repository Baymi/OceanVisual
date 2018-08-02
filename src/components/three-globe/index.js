import React from "react";
import style from "./Globe.css";
import creatAll from "./creatAll";
import NavBar from "./NavBar";
import { clearLoader } from "../../utils/loader";

class Globe extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }

  componentDidMount() {
    creatAll("ThreeContainer", this.routeTo.bind(this));
    clearLoader(200);
  }

  routeTo(url) {
    this.props.history.push(url);
  }

  render() {
    return (
      <div id="ThreeContainer" className={style.fullSize}>
        <NavBar routeTo={this.routeTo.bind(this)} />
      </div>
    );
  }
}

export default Globe;
