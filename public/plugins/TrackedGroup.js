
(function () {
  function pickModel(earth, event) {
    var windowPos = event.windowPosition;
    var pickObj = earth.scene.pick(windowPos);
    if (pickObj instanceof GeoVis.Model) {
      return pickObj
    }
    else {
      return false
    }
  }
  function TrackedGroup(options) {
    this.map = new Engine.AssociativeArray();
    this.clock = new Engine.Clock();
    const { startTime = '2017\/12\/23 17:10', stopTime = "2017\/12\/29 19:55" } = options;
    this.clock.startTime = GeoVis.Date.fromDate(new Date(startTime))
    this.clock.stopTime = GeoVis.Date.fromDate(new Date(stopTime))
    this.clock.shouldAnimate = false;
    this.clock.multiplier = 600;
    this.update = this.update.bind(this);
    this.hoveredEntity =  undefined;
    this.pickedEntity = undefined;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.removeEvents = this.removeEvents.bind(this);
  }

  TrackedGroup.prototype.update = function () {
    this.clock.tick();
    const time = this.clock.currentTime;
    this.map.values.forEach(function (feature) {
      //doing sth
      if (feature.tracking) {
        feature.update(time);
      }
    }, this);
  }

  TrackedGroup.prototype.toggleClock = function (enable) {
    this.clock.shouldAnimate = enable;
    console.log(enable ? '开始航行' : '暂停航行')
  }

  TrackedGroup.prototype.resetClock = function () {
    this.clock.currentTime = this.clock.startTime;//GeoVis.Date.fromDate(new Date('2017-5-22 5:54'))
  }

  TrackedGroup.prototype.initEvents = function () {
    var earth = this.earth;
    earth.on("mouseMove", this.handleMouseMove);
    earth.on("click", this.handleClick);

  }

  TrackedGroup.prototype.removeEvents = function () {
    this.earth.off("mouseMove", this.handleMouseMove);
    this.earth.off("click", this.handleClick);
  }


  TrackedGroup.prototype.handleMouseMove = function (e) {
    var earth = this.earth;
    var model = pickModel(earth, e);
    if(model){
      const entity =  this.map.get(model.id);
      if(this.hoveredEntity !== entity){
         if(this.hoveredEntity && !this.hoveredEntity.picked) this.hoveredEntity.hover(false);
        entity.hover(true);
        this.hoveredEntity = entity;
      }
    } else{
      if(this.hoveredEntity && !this.hoveredEntity.picked ){
       this.hoveredEntity.hover(false);
       this.hoveredEntity = undefined;
     }
    }
  }

  TrackedGroup.prototype.handleClick = function (e) {
    console.log(e)
    var earth = this.earth;
    var model = pickModel(earth, e);
    if(model){
      const entity =  this.map.get(model.id);
      if(this.pickedEntity !== entity){
        if(this.pickedEntity)this.pickedEntity.pick(false);
        entity.pick(true);
        this.pickedEntity = entity;
      }
    } else{
      if(this.pickedEntity)this.pickedEntity.pick(false);
      this.pickedEntity = undefined;
    }
  }



  TrackedGroup.prototype.addTo = function (earth) {
    this.earth = earth;
    this.initEvents();
    earth.on('tick', this.update);
    return this;
  }



  TrackedGroup.prototype.removeFrom = function (earth) {
    this.map.values.forEach(function (feature) {
      feature.removeFrom(this);
      // feature.destroy();
      Engine.destroyObject(feature);
    }, this);
    this.removeEvents();
    this.earth = undefined;
    return this;
  }

  TrackedGroup.prototype.removeAll = function () {
    this.map.values.forEach(function (feature) {
      try {
        feature.removeFrom(this);
        // feature.destroy();
        Engine.destroyObject(feature);
      } catch (e) {
        console.log(e)
      }

    }, this);
  }
  window.TrackedGroup = TrackedGroup;
  return TrackedGroup;
})()



