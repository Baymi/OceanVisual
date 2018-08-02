(function() {
  function TrackedEntity(options) {
    const { entity, positions, times, tracking = true } = options;
    // this._entity =
    this.id = entity.id; // Engine.createGuid();
    this.entity = entity;
    this.tracking = tracking;
    this.picked = false;
    this.hovered = false;
    this.positions = positions;
    this.times = times;
    this.sampledPosition = new Engine.SampledPositionProperty();
    this.sampledPosition.addSamples(times, positions);
    this.orientationProperty = new Engine.VelocityOrientationProperty(
      this.sampledPosition
    );
  }

  var matrix3Scratch = new Engine.Matrix3();
  computeModelMatrix = function(time, result) {
    Check.typeOf.object("time", time);
    var position = Property.getValueOrUndefined(
      this._position,
      time,
      positionScratch
    );
    if (!defined(position)) {
      return undefined;
    }
    var orientation = Property.getValueOrUndefined(
      this._orientation,
      time,
      orientationScratch
    );
    if (!defined(orientation)) {
      result = Transforms.eastNorthUpToFixedFrame(position, undefined, result);
    } else {
      result = Matrix4.fromRotationTranslation(
        Matrix3.fromQuaternion(orientation, matrix3Scratch),
        position,
        result
      );
    }
    return result;
  };

  TrackedEntity.prototype.showRoutes = function(enable) {
    if (enable) {
      if (!this.routeLine) {
        var positions = this.positions;
        var color = [
          GeoVis.Color.fromCssString("#0288d1").withAlpha(1),
          GeoVis.Color.fromCssString("#0288d1").withAlpha(1)
        ];
        this.routeLine = new GeoVis.Polyline(positions, {
          colors: color,
          material: new GeoVis.Material({
            fabric: {
              type: "PolylineDash",
              uniforms: {
                color: GeoVis.Color.fromCssString("#0288d1").withAlpha(1),
                dashLength: 20.0,
                dashPattern: parseInt("1111111111110000", 2)
              }
            }
          }),
          vertexColor: true,
          followSurface: true,
          width: 2.0
        }).addTo(this.earth.features);
      } else {
        this.routeLine.visible = enable;
      }
    } else {
      if (this.routeLine) this.routeLine.visible = enable;
    }
  };

  TrackedEntity.prototype.update = function(time) {
    const position = this.sampledPosition.getValue(time);
    if (position) {
      // var modelMatrix = GeoVis.Transforms.eastNorthUpToFixedFrame(position);
      var orientation = this.orientationProperty.getValue(time);
      if (!orientation) return;
      var hpr = GeoVis.HeadingPitchRoll.fromQuaternion(orientation);
      var transform = GeoVis.Transforms.headingPitchRollToFixedFrame(
        position,
        hpr
      );
      var result = Engine.Matrix4.fromRotationTranslation(
        Engine.Matrix3.fromQuaternion(orientation, matrix3Scratch),
        position
      );
      // console.log(time.toString())
      this.entity.modelMatrix = result;
    }
  };

  TrackedEntity.prototype.pick = function(enable) {
    this.picked = enable;
    this.showRoutes(enable);
    if (enable) {
      // document.getElementById("track-panel").style.display="block";
      this.entity.silhouetteSize = 2;
    } else {
      // document.getElementById("track-panel").style.display="none";
      this.entity.silhouetteSize = 0;
    }
    return this;
  };

  TrackedEntity.prototype.hover = function(enable) {
    this.hovered = enable;
    this.showRoutes(enable);
    if (enable) {
      this.entity.silhouetteSize = 4;
    } else {
      this.entity.silhouetteSize = 0;
    }
    return this;
  };

  TrackedEntity.prototype.addTo = function(group) {
    group.map.set(this.id, this);
    this.group = group;
    this.earth = group.earth;
    this.scene = group.earth.scene;
    return this;
  };

  TrackedEntity.prototype.removeFrom = function(group) {
    if (this.routeLine) this.routeLine.removeFrom(this.earth.features);
    // features.remove(this);
    group.map.remove(this.id);
    this.features = undefined;
    this.earth = undefined;
    this.scene = undefined;
    return this;
  };
  window.TrackedEntity = TrackedEntity;
  return TrackedEntity;
})();
