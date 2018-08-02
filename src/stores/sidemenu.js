"use strict";

import {observable, action} from "mobx";

class Sidemenu {
  @observable collapsed = false;
  @observable openKeys = ['0'];
  @observable rootSubmenuKeys = ['0', '1', '2', '3', '4'];
  @action
  toggleCollapsed = () => {
    this.collapsed = !this.collapsed;
  };

  @action
  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
    console.log('latestOpenKey:', openKeys, latestOpenKey);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.openKeys = [];
    } else if (latestOpenKey) {
      this.openKeys = [latestOpenKey];
    } else {
      this.openKeys = [];
    }
  };
}

export default Sidemenu;
