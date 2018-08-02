import { observable, computed, action } from "mobx";
import { showBuoy, removeAll } from "./ext/InfoHelper";

class Information {
  @observable buoyId = 1;
  @observable buoyData = [];
  @observable show = false;
  @observable showPanel = false;
  constructor(earth) {
    this.earth = earth;
    this.buoyData = [{
      "imageUrl": "./data/station1.jpg",
      "lon": 123.50484139813774,
      "lat": 30.070476290159217,
      "name": "东海01号浮标",
      "id": 1,
      "collect": "采样间隔10分钟",
      "wSpeed": "3.4m/s",
      "jing1": "±1.2",
      "wDirection": "56°",
      "jing2": "±3.6",
      "temp": "23°C",
      "jing3": "±4.6",
      "press": "960hPa",
      "jing4": "±23"
    }];
  }

  @action
  toggleShow = () => {
    // document.getElementById("searthDiv").style.display = "block"
    showBuoy(this.updateBuoy);
    $.ajax({
      url: `./resource/buoy.json`,
      dataType: "json",
      async: false,
      success: data => {
        this.buoyData = data;
      }
    });
    this.show = true;
  };

  @action
  reset = () => {
    this.show = false;
    this.showPanel = false;
    removeAll();
  };

  @action
  unmount = () => {
    removeAll();
  };

  @action
  updateBuoy = id => {
    console.log(id);
    this.buoyId = id;
  };

  @action
  toggleList = id => {
    this.showPanel = true;
    id = id[id.length - 1];
    
    id = Number(id);
    this.buoyId = id;
    console.log(id);
    var lon = this.buoyData[id - 1].lon;
    var lat = this.buoyData[id - 1].lat;
    earth.camera.flyTo({
      destination: GeoVis.Vector3.fromDegrees(lon, lat, 252740),
      duration: 2
    });
    var pickedId = this.buoyId.toString();
    $(".buoy-station").css('background', 'url(./data/markers/buoy.png)  no-repeat');
    $('#' + pickedId + '').css('background', 'url(./data/markers/buoypicked.png)  no-repeat');
    // document.getElementById(pickedId).style.backgroundImage = "url(./data/markers/buoypicked.png)";
  };

  @action
  toggleList2 = (val) => {
    console.log(val)
  }

  @computed
  get picked() {
    return this.buoyData[this.buoyId - 1] || {};
  }
}

export default Information;
