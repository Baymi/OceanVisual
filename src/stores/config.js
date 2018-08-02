"use strict";

import { observable, action } from "mobx";

class Config {
  constructor() {
    window.addEventListener("hashchange", this.handleHash);
    this.handleHash();
  }
  @observable currentPlugin = "";
  serialize() {
    const data = {};
    return data;
  }

  @action
  unserialize() {}

  @action
  handleHash = () => {
    var hashVal = window.location.hash.substring(1);
    this.currentPlugin = hashVal;
    console.log(hashVal);
  };

  @action
  mountPlugin = id => {
    // console.log(`changePlugin to ${id}`);
    const currentPlugin = this.currentPlugin === id ? "index" : id;
    window.location.replace(`#${currentPlugin}`);
    console.log(`changePlugin to ${this.currentPlugin}`);
  };

}

export default Config;
