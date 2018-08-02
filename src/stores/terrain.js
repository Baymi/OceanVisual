import { observable, action } from "mobx";
import {
  createImgLayer,
  createMapLayer,
  createTerrainLayer,
  createWatermask,
  createServerBilTerrain,
  createViewingLayer,
  track
} from "./ext/TerrainHelper";

window.cps = [];

window.cameraCapture = function() {
  const roll = (earth.camera.roll * 180) / Math.PI;
  const heading = (earth.camera.heading * 180) / Math.PI;
  const pitch = (earth.camera.pitch * 180) / Math.PI;
  cps.push([heading, pitch, roll]);
};
const terrainConfig = {
  terrain: {
    landScale: 20,
    oceanScale: 20,
    waterMask: false
  },
  map: {
    landScale: 1,
    oceanScale: 1,
    waterMask: false
  },
  img: {
    landScale: 2,
    oceanScale: 5,
    waterMask: false
  }
};

class Terrian {
  @observable terSubItem = [];
  //增加地形菜单子选项
  @observable currentLayer = "img";
  @observable enableTerrain = false;
  // 基于纹理的单纯的水覆盖
  @observable enableWater = false;
  // 基于地形的水覆盖，enableTerrain=true时生效
  @observable enableTerrainWater = false;
  @observable landScale = 1;
  @observable oceanScale = 1;
  constructor(earth) {
    this.earth = earth;
    earth.clock.currentTime = GeoVis.Date.fromDate(new Date("2018/1/3 0:20"));
    this.layers = [];
    this.waterMask = undefined;
    this.terrain = undefined;
    this.layers["img"] = createImgLayer(earth);
    // this.layers["img"].visible = false
    this.layers["map"] = createMapLayer(earth);
    this.layers["map"].visible = false;
    this.layers["terrain"] = createTerrainLayer(earth);
    this.layers["terrain"].visible = false;

    // viewICRF
    earth.on("tick", this.viewICRF);
    this.viewing = false;
    this.viewport = {};
    window.navTo = this.navTo;
  }

  viewICRF = () => {
    if (this.viewing) {
      const earth = this.earth;
      const {
        longitude,
        latituede,
        height,
        pitch,
        exceptHeading
      } = this.viewport;
      let newHeading = exceptHeading + (0.04 * Math.PI) / 180; // - exceptHeading;earth.camera.heading
      console.log(earth.camera.heading, exceptHeading);
      this.viewport.exceptHeading = newHeading;
      newHeading = newHeading > Math.PI ? newHeading - 2 * Math.PI : newHeading;
      this.viewport.exceptHeading = newHeading;
      const center = GeoVis.Vector3.fromDegrees(longitude, latituede, height);
      var currentPitch =
        earth.camera.pitch < pitch
          ? earth.camera.pitch + 0.01
          : earth.camera.pitch;
      var currentRange = earth.camera.getMagnitude();
      var transform = Engine.Transforms.eastNorthUpToFixedFrame(center);
      earth.camera.lookAtTransform(
        transform,
        new GeoVis.HeadingPitchRange(newHeading, pitch, currentRange)
      );
    }
  };

  @action
  toggleBaseLayer = type => {
    if (this.currentLayer !== "")
      this.layers[this.currentLayer].visible = false;
    this.currentLayer = this.currentLayer === type ? "" : type;
    const currentLayer = this.layers[this.currentLayer];
    if (currentLayer) currentLayer.visible = true;
    // currentLayer ? (currentLayer.visible = true) : null;
  };

  @action
  toggleTerrain = enable => {
    if (this.enableTerrain === enable) return;
    this.enableTerrain = !!enable;
    if (this.enableTerrain) {
      this.earth.scene.fog.enabled = false;

      // 适配不同图层
      const config = terrainConfig[this.currentLayer];
      this.landScale = config.landScale;
      this.oceanScale = config.oceanScale;
      // this.toggleWater(config.waterMask);

      this.earth.scene.globe.terrainProvider = createServerBilTerrain({
        scale: 1,
        landScale: this.landScale,
        oceanScale: this.oceanScale,
        waterMask: this.enableTerrainWater
      });
    } else {
      this.earth.scene.fog.enabled = true;
      this.earth.scene.globe.terrainProvider = new Engine.EllipsoidTerrainProvider();
    }
  };

  @action
  changeScale = options => {
    const {
      oceanScale = this.oceanScale,
      landScale = this.landScale
    } = options;
    if (oceanScale === this.oceanScale && landScale === this.landScale) return;
    this.earth.scene.globe.terrainProvider = createServerBilTerrain({
      scale: 1,
      landScale,
      oceanScale,
      waterMask: this.enableTerrainWater
    });
    this.oceanScale = oceanScale;
    this.landScale = landScale;
  };

  @action
  toggleWater = enable => {
    if (this.enableWater === enable) return;
    this.enableWater = enable;
    if (this.enableWater) {
      if (!this.waterMask) {
        this.waterMask = createWatermask(this.earth);
      }
      this.waterMask.show = true;
    } else {
      this.waterMask && (this.waterMask.show = false);
    }
  };

  @action
  toggleTerrainWater = enable => {
    if (this.enableTerrainWater === enable) return;
    this.enableTerrainWater = enable;
    if (this.enableTerrain) {
      this.toggleTerrain(true);
    }
  };

  @action
  reset = () => {
    this.toggleWater(false);
    this.toggleTerrain(false);
    this.toggleBaseLayer("img");
  };

  trackRoute = async () => {
    const res = await fetch("./resource/terrain/routes.json");
    const data = await res.json();
    const clock = this.clock ? this.clock : new Engine.Clock();
    track(data, this.earth, clock);
  };

  @action
  navTo = item => {
    const { longitude, latituede, height, heading, pitch, range, layer } = item;
    if (
      this.viewport.longitude &&
      this.viewport.longitude.toFixed(6) === longitude.toFixed(6)
    ) {
      this.viewing = false;
      this.viewport = {};
      this.earth.camera.lookAtTransform(GeoVis.Matrix4.IDENTITY);
      return;
    }
    this.viewport = {
      longitude,
      latituede,
      height,
      heading,
      pitch,
      range,
      exceptHeading: heading
    };
    const camera = this.earth.camera;
    const center = GeoVis.Vector3.fromDegrees(longitude, latituede, height);
    const bouding = new Engine.BoundingSphere(center, range);
    camera.flyToBoundingSphere(bouding, {
      offset: new Engine.HeadingPitchRange(heading, pitch, range),
      complete: () => {
        camera.lookAt(
          center,
          new Engine.HeadingPitchRange(heading, pitch, range)
        );
        this.viewing = true;
      }
    });

    if (this.viewingLayer) this.viewingLayer.removeFrom(this.earth.layers);
    if (layer) {
      this.viewingLayer = createViewingLayer(this.earth, layer);
    }
  };

  @action
  serialize() {
    const {
      currentLayer,
      enableTerrain,
      enableWater,
      enableTerrainWater,
      landScale,
      oceanScale
    } = this;
    return {
      currentLayer,
      enableTerrain,
      enableWater,
      enableTerrainWater,
      landScale,
      oceanScale
    };
  }

  @action
  unserialize(state) {
    const {
      currentLayer,
      enableTerrain,
      enableWater,
      enableTerrainWater,
      landScale,
      oceanScale
    } = state;
    const earth = this.earth;
    this.viewing = false;
    if (this.viewingLayer) this.viewingLayer.removeFrom(earth.layers);
    earth.camera.flyHome();
    if (currentLayer !== undefined && currentLayer !== this.currentLayer) {
      this.toggleBaseLayer(currentLayer);
    }
    if (enableTerrainWater !== undefined) {
      this.toggleTerrainWater(enableTerrainWater);
    }
    if (enableTerrain !== undefined) {
      this.toggleTerrain(enableTerrain);
    }
    if (enableWater !== undefined) {
      this.toggleWater(enableWater);
    }
    if (landScale !== undefined || oceanScale !== undefined) {
      this.changeScale({ landScale, oceanScale });
    }
  }
}
export default Terrian;
