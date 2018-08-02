import { observable, computed, action } from "mobx";
import {
  removeAll,
  rectangleMark,
  lineMark,
  resetPoints,
  changeDepth,
  showSelect,
  showWeather,
  showVisible
} from "./ext/CtdHelper";

class CTD {
  @observable ctdSubItem = [];
  //增加CTD菜单子选项
  @observable currentType = "prdm";
  @observable chartData = [];
  @observable jLength = 0;
  @observable stationId = 1;
  @observable monitorType = 0;
  @observable stationData = [];

  constructor(earth) {
    this.earth = earth;
    // this.currentType = undefined;
    this.chartData = [["Value", "Layer", "Num"], []];
    this.jLength = 0;
    this.stationId = 1;
    this.tideId = 1;
    this.monitorType = "tide";
  }

  @action
  toggleType = type => {
    this.currentType = type;
    console.log(type);
    showSelect(this.earth, this.currentType);
    $.ajax({
      url: `./resource/stationInfo.json`,
      dataType: "json",
      async: false,
      success: data => {
        this.stationData = data;
      }
    });
  };

  @action
  toggleDepth = depth => {
    changeDepth(depth);
  };

  @action
  toggleRectangle = () => {
    rectangleMark();
  };

  @action
  toggleLine = () => {
    lineMark(this.updateChartData, this.updatejLength, this.updateStation, this.updateTide); // 将this.updateChartData传入lineMark来执行updateChartData操作
  };

  @action
  toggleReset = () => {
    resetPoints();
  };

  @action
  updateChartData = data => {
    // 只能通过action来获得当前值
    this.chartData = data;
  };

  @action
  updatejLength = data => {
    // 只能通过action来获得当前值
    this.jLength = data;
  };

  @action
  updateStation = data => {
    // console.log(data);
    this.stationId = data;
  };

  @action
  updateTide = data => {
    console.log(data);
    this.tideId = data;
  };

  @computed 
  get picked(){
    return this.stationData[this.stationId - 1] || {};
  }

  @computed 
  get returnId(){
    return this.tideId;
  }

  @action
  toggleMonitor = value => {
    console.log(value);
    this.monitorType = value;
  };

  @action
  unmount = () => {
    removeAll();
  };
}

export default CTD;
