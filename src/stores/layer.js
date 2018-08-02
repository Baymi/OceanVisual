"use strict";

import { observable, computed, action } from "mobx";

import TileModel from "./TileModel";
import SSECModel from "./SSECModel";
import fetchData from "../../Util/fetchData";

class LayerManager {
  @observable products = [];
  @observable categorys = [];
  @observable spliting = false;
  constructor(earth) {
    this.earth = earth;
    this.loaded = false;
    // this.init();
  }

  async init() {
    if (this.loaded) return;
    this.loaded = true;
    const text = await fetchData("./data/DataManager/datalist.json");
    const typelist = JSON.parse(text);
    typelist.map(typeitem => {
      this.categorys.push(typeitem.category);
      typeitem.products.map(product => {
        const options = {
          category: typeitem.category,
          earth: window.earth,
          ...product
        };
        switch (product.displaytype) {
          case "tile":
            this.products.push(new TileModel(options));
            break;
          case "ssec":
            this.products.push(new SSECModel(options));
            break;
          default:
            this.products.push(new TileMode(options));
        }
      });
    });
  }

  @computed
  get viewlist() {
    return this.products.filter(product => product.viewing);
  }

  @action
  toggleSplit = () => {
    this.spliting = !this.spliting;
    if (!this.spliting) {
      this.viewlist.forEach(item => item.toggleSplit(0));
    }
  };

  @action
  removeAll = () => {
    return this.products.filter(product => {
      if (product.viewing) {
        product.toggleView();
      }
    });
  };

  @action
  clearAll = () => {
    this.viewlist.forEach(item => item.toggleView());
  };

  @action
  serialize() {
    const data = {};
    return data;
  }

  @action
  unserialize() {}
}

export default LayerManager;
