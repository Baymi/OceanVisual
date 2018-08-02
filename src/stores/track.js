import { observable, action, runInAction, computed } from "mobx";
import { createModel, getSamples, pickModel } from "./ext/Trackhelper";
class Terrian {
  @observable traSubItem = [];
  @observable routeList = [];
  @observable times = [];
  @observable positions = [];
  @observable minTime = 0;
  @observable maxTime = 0;
  @observable currentTime = 0;
  @observable play = false;
  @observable trackEnable = false;
  constructor(earth) {
    this.earth = earth;
  }

  @action
  init = async () => {
    this.trackEnable = true;
    if (this.trackedGroup) return;
    const text = await fetch("./resource/track/list.json");
    const list = await text.json();
    this.trackedGroup = new TrackedGroup({}).addTo(earth);
    this.trackedGroup.clock.onTick.addEventListener(this.onTick);
    this.trackedEntity = undefined;
    runInAction(() => {
      this.routeList = list;
    });
  };

  @action
  onTick = () => {
    this.currentTime = GeoVis.Date.toDate(
      this.trackedGroup.clock.currentTime
    ).getTime();
  };

  @action
  loadRoute = async id => {
    const text = await fetch(`./resource/track/${id}.json`);
    const data = await text.json();
    const route = data.voyageStationList;
    if (!route) return;
    const { times, positions } = getSamples(route);
    console.log(times, positions);
    if (this.model) {
      this.model.destroy();
    }

    // 创建模型
    this.model = createModel(
      "./data/models/sea/ship/ship.gltf",
      800.0,
      positions[0]
    );
    if (this.trackedEntity) {
      this.trackedEntity.removeFrom(this.trackedGroup);
    }
    this.model.id = 1;
    // 绑定Track
    this.trackedEntity = new TrackedEntity({
      entity: this.model,
      positions,
      times
    });
    this.trackedEntity.addTo(this.trackedGroup);
    this.trackedEntity.showRoutes(true);
    this.trackedGroup.resetClock();

    // 更新相机
    const boundingSphere = Engine.BoundingSphere.fromPoints(positions);
    this.earth.camera.flyToBoundingSphere(boundingSphere);

    // 更新Sotores
    runInAction(() => {
      this.times = times;
      this.positions = positions;
      this.minTime = GeoVis.Date.toDate(times[0]).getTime();
      this.maxTime = GeoVis.Date.toDate(times[times.length - 1]).getTime();
      this.currentTime = this.minTime;
    });

    earth.on('click', (e) => pickModel(e, this.models, this.trackEnable));
  };

  @action
  changeTime = e => {
    const time = parseInt(e.target.value);
    this.currentTime = time;
    this.trackedGroup.clock.currentTime = GeoVis.Date.fromDate(new Date(time));
  };

  @computed
  get timelineVisible() {
    if (this.times.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  @action
  toggleClock = () => {
    this.play = !this.play;
    this.trackedGroup.toggleClock(this.play);
  };
  @action
  unmount = () => {
    this.trackEnable = false;
    this.play = false;
    this.trackedGroup.toggleClock(this.play);

    if (this.trackedEntity) this.trackedEntity.removeFrom(this.trackedGroup);
    this.trackedEntity = undefined;
    if (this.model) {
      this.model.removeFrom(this.earth.features);
      // this.model.destroy();
      this.model = undefined;
    }

    this.times = [];
  };
}
export default Terrian;
