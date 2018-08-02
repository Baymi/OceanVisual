const { GeoVis, Engine } = window;

export function createModel(url, scale, position, RotateZ) {
  // earth.features.remove(model);
  var vec = position;
  var modelMatrix = GeoVis.Transforms.eastNorthUpToFixedFrame(vec);
  var hpr = new Engine.HeadingPitchRoll(0.0, Engine.Math.PI_OVER_TWO, 0.0);
  var or = Engine.Transforms.headingPitchRollQuaternion(vec, hpr);
  var model = GeoVis.Model.fromGltf({
    url: url,
    modelMatrix: modelMatrix,
    scale: scale
    // orientation: or
  });
  if (RotateZ === undefined) {
    RotateZ = 0;
  }
  var mm = model.modelMatrix;
  var mm1 = Engine.Matrix3.fromRotationZ(Engine.Math.toRadians(RotateZ));
  Engine.Matrix4.multiplyByMatrix3(mm, mm1, mm);
  model.modelMatrix = mm;
  model.addTo(earth.features);
  return model;
}

export function getSamples(data) {
  // console.log("in~");
  let positions;
  let lonlatArr = [];
  let times = [];
  // data = data.sort((item, preItem) => {
  //   return (
  //     new Date(item.datetime).getTime() - new Date(preItem.datetime).getTime()
  //   );
  // });
  data.map((item,index) => {
    let date;
    if (lonlatArr.length === 0) {
      date = GeoVis.Date.fromDate(new Date(item.datetime));
    } else {
      // let preItem = lonlatArr[lonlatArr.length - 1];
      let londelta = lonlatArr[index*2-2] - item.lng;
      let latdelta = lonlatArr[index*2-1] - item.lat;
      const distance = Math.sqrt(londelta * londelta + latdelta * latdelta);
      console.log(lonlatArr[index*2-2], item.lng, distance)
      date= new GeoVis.Date();
      GeoVis.Date.addSeconds(times[times.length - 1], distance * 3e4,date);
    }
    // const
    lonlatArr = lonlatArr.concat([item.lng, item.lat]);
    times.push(date);
  });
  positions = GeoVis.Vector3.fromDegreesArray(lonlatArr);
  return { positions, times };
}

export function pickModel(event, models, trackEnable) {
  if(trackEnable){
    var windowPos = event.windowPosition;
    var pickObj = earth.scene.pick(windowPos);
    if (pickObj instanceof GeoVis.Model) {
        document.getElementById("track-panel").style.display = "block";
        console.log(pickObj.id)
    }
    else {
      document.getElementById("track-panel").style.display = "none";
    }
  }


}
