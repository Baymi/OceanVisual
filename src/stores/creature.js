import { observable, computed, action } from "mobx";
import {
  createModel,
  pickModel,
  removeAll
} from "./ext/CreatureHelper";

class Creature {
  @observable creSubItem = [];
  @observable models = [];
  @observable modelId = 1;
  @observable typeData = [];
  constructor(earth) {
    this.earth = earth;
    this.typeData = [{
      "id": 1,
      "titleUrl": "./resource/creature/sponge/title1.png",
      "title": "",
      "subUrl": "./resource/creature/sponge/sub1.png",
      "sub": "",
      "lon": 126.974911,
      "lat": 27.5410423,
      "collect": "",
      "des": ""
    }];

  }

  @action
  toggleType = type => {
    console.log(type);
    /*if (type.length > 0) {
      type = type[type.length - 1]
    }*/
    this.currentType = type;
    var typeData;
    var dataUrl = `./resource/creature/${type}.json`;
    $.ajax({
      url: dataUrl,
      dataType: "json",
      async: false,
      success: data => {
        typeData = data;
      }
    });

    typeData.map(item => {
      var lon = item.lon;
      var lat = item.lat;
      var height = item.height;
      var rotateZ = item.rotateZ;
      var zoom = item.zoom;
      var modelId = item.id;
      var url = `./data/models/sea/${type}/${type}.gltf`;
      var model = createModel(url, zoom, [lon, lat, height], rotateZ);// 模型路径，放大倍数，【经纬度，海拔】，水平顺时针旋转度数
      model.id = modelId;
      model.type = type;
      this.models.push(model);
    })
    this.typeData = typeData;
    this.earth.camera.flyTo({
      destination: GeoVis.Vector3.fromDegrees(127.474353, 27.405792, 50000),
      orientation: {
        heading: 5.493,
        pitch: -0.677,
        roll: 6.28
      },
      duration: 2
    });
    earth.on('mouseMove', (e) => pickModel(e, this.models, this.updateId, this.updatePicktype));

  };

  @action
  updateId = id => {
    this.modelId = id;
  };//返回拾取的模型id


  @computed
  get picked() {
    return this.typeData[this.modelId - 1] || {};
  }

  @action
  updatePicktype = pickType => {
    var typeData;
    $.ajax({
      url: `./resource/creature/${pickType}.json`,
      dataType: "json",
      async: false,
      success: data => {
        typeData = data;
        // this.typeData = typeData;
      }
    });
    console.log(typeData);
    this.typeData = typeData;
  };//返回拾取的模型种类

  @action
  unmount = () => {
    removeAll();
  };

}

export default Creature;
