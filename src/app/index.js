import React from "react";

import ThreeGlobe from "../components/three-globe";
import App from "./app";

class Router extends React.Component {
  constructor() {
    super();
    const hashVal = window.location.hash.substring(1);
    this.state = {
      hashVal
    };
    window.addEventListener("hashchange", this.handleHash);
  }

  handleHash = hash => {
    const hashVal = window.location.hash.substring(1);
    this.setState({
      hashVal
    });
  };
  render() {
    if (this.state.hashVal === "") {
      return <ThreeGlobe />;
    } else {
      return <App />;
    }
  }
}

export default Router;
