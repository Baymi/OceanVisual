import React, { Component } from "react";
import { configure } from "mobx";
import { Provider, observer } from "mobx-react";
import createStore from "../stores";
import Globe from "../components/globe";
import Navigator from "../components/side-navigator";
import plugins from "../plugins";
import { clearLoader } from "../utils/loader";

configure({
  enforceActions: true
});

// @inject(stores => ({
//   currentPlugin: stores.config.currentPlugin
// }))
@observer
export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      earthLoading: false
    };
    this.stores = { config: {} };
    this.onEarthComplete = this.onEarthComplete.bind(this);
  }

  // componentDidMount() {

  // }

  onEarthComplete(earth) {
    this.stores = createStore(earth);
    window.earth = earth;
    this.setState({
      earthLoading: true
    });
    clearLoader();
  }

  render() {
    const { earthLoading } = this.state;
    const { currentPlugin } = this.stores.config;
    const stores = this.stores;
    const Plugin = plugins[currentPlugin] || (() => null);
    if (Plugin.InitialState && earthLoading)
      this.stores.terrain.unserialize(Plugin.InitialState.terrain);
    return (
      <div>
        {/*  */}
        <Globe onComplete={this.onEarthComplete.bind(this)} />
        {earthLoading && (
          <Provider {...stores}>
            <div>
              <Navigator />
              <Plugin />
            </div>
          </Provider>
        )}
      </div>
    );
  }
}
