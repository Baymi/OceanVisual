var { GeoVis, Engine } = window;
var polygons = [];
var lines = [];
var allPoints = [];
var linePoints = [];
var lineData = [];
var chartData = [];
var markers = [];
var selectedPos;
var theType;
var valueMin;
var valueDelt;
function removeRec() {
  if (polygons !== undefined) {
    polygons.forEach(polygon => {
      polygon.removeFrom(earth.features);
    }, this);
  }
  polygons = [];

  if (lines !== undefined) {
    lines.forEach(line => {
      line.removeFrom(earth.features);
    }, this);
  }
  lines = [];
}

export function removeAll() {
  if (markers !== undefined) {
    markers.forEach(marker => {
      marker.removeFrom(earth.features);
    }, this);
  }
  polygons = [];

  if (allPoints !== undefined) {
    allPoints.forEach(point => {
      point.removeFrom(earth.features);
    }, this);
  }
  allPoints = [];

  if (linePoints !== undefined) {
    linePoints.forEach(point => {
      point.removeFrom(earth.features);
    }, this);
  }
  linePoints = [];

  if (lines !== undefined) {
    lines.forEach(line => {
      line.removeFrom(earth.features);
    }, this);
  }
  lines = [];
}

export function rectangleMark() {
  var lat1 = 0.0;
  var lat2 = 0.0;
  var lat3 = 0.0;
  var lat4 = 0.0;
  var lng1 = 0.0;
  var lng2 = 0.0;
  var lng3 = 0.0;
  var lng4 = 0.0;
  var clickIndex = -1,
    doubleClickIndex = -1,
    rightClickIndex = -1;
  var flag = 0;
  var startposition;
  var color = GeoVis.Color.fromCssString("#ffffff").withAlpha(1.0);
  var positions = [[112, 28], [114, 28]];
  var colorgon = GeoVis.Color.fromCssString("#00BFFF").withAlpha(0.8);

  var rec = new GeoVis.Polygon(positions, {
    async: false,
    fillColor: colorgon,
    fill: true,
    extrudedHeight: 5000 * 13,
    outline: true,
    outlineColor: GeoVis.Color.WHITE,
    outlineWidth: 2.0
  });
  polygons.push(rec);

  if (earth._listeners.click && earth._listeners.click.length == 1) {
    earth._listeners.click.splice(0, 1);
  }

  if (
    earth._listeners.doubleClick &&
    earth._listeners.doubleClick.length == 1
  ) {
    earth._listeners.doubleClick.splice(0, 1);
  }

  function begainPosition(event) {
    if (event.position === undefined) return;
    startposition = event.position;
    flag = 1;
  }

  function followMouse(startposition, event) {
    if (event.position === undefined) return;
    lat1 = startposition[1]; // 纬度
    lng1 = startposition[0]; // 经度
    lat2 = event.position[1];
    lng2 = event.position[0];
    lat3 = event.position[1];
    lng3 = startposition[0];
    lat4 = startposition[1];
    lng4 = event.position[0];
    positions = [
      [lng1, lat1],
      [lng3, lat3],
      [lng2, lat2],
      [lng4, lat4],
      [lng1, lat1]
    ];
    rec.positions = positions;
    rec.addTo(earth.features);
  }

  earth.on("click", e => {
    if (flag === 0) {
      begainPosition(e);
    } else if (flag === 1) {
      selectedPos = polygons[0]._positions;
      selectPoints(selectedPos, allPoints);
      flag = 2;
    } else {
    }
  });
  clickIndex = earth._listeners.click.length - 1;

  earth.on("mouseMove", e => {
    if (flag === 1) {
      followMouse(startposition, e);
    } else {
      // document.getElementById('fmm').style.display = 'none';
    }
  });

  earth.on("rightClick", () => {
    removeRec();
    // rec.removeFrom(earth.features);
    flag = 2;
  });
  rightClickIndex = earth._listeners.rightClick.length - 1;
}

export function lineMark(updateChartData, updatejLength, updateStation, updateTide) {
  var colors = [GeoVis.Color.fromCssString("#FF0000").withAlpha(1.0)];

  var coloring = [GeoVis.Color.fromCssString("#FF0000").withAlpha(0.4)];
  var colorgon = GeoVis.Color.fromCssString("#00BFFF").withAlpha(0.8);
  var lineHeight = 0;
  var positions = [[111.0, 30.0, 0], [111.0, 30.0, 0]];
  var positioning = [[111.0, 30.0, 0], [111.0, 30.0, 0]];

  var beginId;
  var flag = 0;

  // var polying = new GeoVis.Polyline(positioning, {
  //   colors: coloring,
  //   vertexColor: true,
  //   followSurface: true,
  //   width: 2.0
  // });

  var polying = new GeoVis.Polygon(positions, {
    async: false,
    fillColor: colorgon,
    fill: true,
    extrudedHeight: 5000 * 14,
    outline: false
  });
  // polygons.push(rec);
  lines.push(polying);
  var startposition;
  var marker = undefined;

  var polyline;
  var count = 0;
  var distances = [];
  var perDistance;
  var clickIndex = -1,
    doubleClickIndex = -1,
    rightClickIndex = -1;

  if (earth._listeners.click && earth._listeners.click.length == 1) {
    earth._listeners.click.splice(0, 1);
  }

  if (
    earth._listeners.doubleClick &&
    earth._listeners.doubleClick.length == 1
  ) {
    earth._listeners.doubleClick.splice(0, 1);
  }

  function begainPosition(event) {
    if (event.position === undefined) return;
    polyline = new GeoVis.Polygon(positions, {
      async: false,
      fillColor: colorgon,
      fill: true,
      extrudedHeight: 5000 * 14,
      outline: false
    });
    positions = [];
    distances = [];
    positions.push([event.position[0]+0.01, event.position[1], 0]);
    positions.push([event.position[0], event.position[1], 0]);
    startposition = [event.position[0], event.position[1], lineHeight];
    polyline.positions = positions;
    polyline.addTo(earth.features);
    lines.push(polyline);
    flag = 1;
  }

  var idCount = 1;

  function changePosition(event) {
    if (event.position === undefined) return;
    positions.push([event.position[0] + 0.01, event.position[1], 0]);
    positions.push([event.position[0], event.position[1], 0]);
    polyline.positions = positions;
    idCount++;
  }

  function followMouse(lastPosition, event) {
    if (event.position === undefined) return;
    positioning = [];
    positioning.push([lastPosition[0]+0.01, lastPosition[1], 0]);
    positioning.push([lastPosition[0], lastPosition[1], 0]);
    positioning.push([event.position[0]+0.01, event.position[1], 0]);
    positioning.push([event.position[0], event.position[1], 0]);
    polying.positions = positioning;
    polying.addTo(earth.features);
  }

  earth.on("click", e => {
    if (flag === 0) {
      begainPosition(e);
    } else if (flag === 1) {
      removeLinepoints();
      document.getElementById("ctdLeft").style.display = "block";
      changePosition(e);
      showLine();
      loadStation();

      chartData.push(["Value", "Layer", "Num"]);
      var jLength = lineData.length / 11;
      var x, y, i;
      var value;

      for (i = 0; i < lineData.length; i++) {
        x = lineData[i][0] / 5000;
        y = i % jLength;
        value = lineData[i][1];
        chartData.push([value, 10 - x, y]);
      }
      /// ///////////////////////////////////////
      var stationPo;
      var stationId = 1;
      $.ajax({
        url: `./resource/stationInfo.json`,
        dataType: "json",
        async: false,
        success: data => {
          stationPo = data;
        }
      });

      earth.on("mouseMove", event => {
        var windowPos = event.windowPosition;
        var pickObj = earth.scene.pick(windowPos);
        if (pickObj instanceof GeoVis.Billboard && pickObj.id) {
          console.log(pickObj);
          var str = pickObj.id;
          var pickType = str.split("&")[0];
          var pickNum = str.split("&")[1];
          if (pickType == "station") {
            document.getElementById("stationContainer").style.display = "block";
            document.getElementById("tideContainer").style.display = "none";
            stationId = Number(pickNum);
            console.log(pickNum);
            updateStation(stationId);
          } else if (pickType == "tide") {
            document.getElementById("tideContainer").style.display = "block";
            document.getElementById("stationContainer").style.display = "none";
            stationId = Number(pickNum);
            // console.log(pickNum);
            updateTide(stationId);
          }
        }
      });
     
      updateChartData(chartData);
      updatejLength(jLength);

      flag = 2;
    } else {
    }
  });

  clickIndex = earth._listeners.click.length - 1;
  earth.on("mouseMove", e => {
    if (flag === 1) {
      followMouse(positions[positions.length - 1], e);
    } else {
    }
  });
  earth.on("rightClick", () => {
    removeRec();
    lines = [];
    lineData = [];
    chartData = [];
    flag = 2;
  });
  rightClickIndex = earth._listeners.rightClick.length - 1;
}

function selectPoints(selectedPos, allPoints) {
  var lonMin, lonMax, latMin, latMax;
  if (selectedPos[0][0] < selectedPos[2][0]) {
    lonMin = selectedPos[0][0];
    lonMax = selectedPos[2][0];
  } else {
    lonMin = selectedPos[2][0];
    lonMax = selectedPos[0][0];
  }

  if (selectedPos[0][1] < selectedPos[2][1]) {
    latMin = selectedPos[0][1];
    latMax = selectedPos[2][1];
  } else {
    latMin = selectedPos[2][1];
    latMax = selectedPos[0][1];
  }

  allPoints.map(item => {
    if (
      item.lonlat[0] < lonMin ||
      item.lonlat[0] > lonMax ||
      item.lonlat[1] < latMin ||
      item.lonlat[1] > latMax
    ) {
      // item.removeFrom(earth.features)
      item._primitive.show = false;
    }
  });
  removeLinepoints();
}

var interpolate = GeoVis["interpolate"];
var colormap = [];

colormap["potemp"] = interpolate([
  "#0000ff",
  "#0045ff",
  "#0085ff",
  "#00cbff",
  "#00fff7",
  "#00ffb5",
  "#00ff73",
  "#10ff00",
  "#b5ff00",
  "#deff00",
  "#ffe700",
  "#ffa200",
  "#ff6100",
  "#ff2c00",
  "#ff0000"
]);
colormap["prdm"] = interpolate([
  "#5440B6",
  "#4349C9",
  "#4D66D2",
  "#5775D5",
  "#4F97E1",
  "#84B9FB",
  "#73E1E7",
  "#ABF7EB",
  "#CBFBDA",
  "#EEFDCA",
  "#F9FAD5",
  "#FCF2AC",
  "#FDE37D",
  "#FCC865",
  "#FA9200"
]);

colormap["sbeox"] = interpolate([
  "rgba(82, 71, 141, 1.0)",
  "rgba(80, 87, 184, 1.0)",
  "rgba(57, 136, 199, 1.0)",
  "rgba(75, 182, 152, 1.0)",
  "rgba(69, 206, 66, 1.0)",
  "rgba(149, 219, 70, 1.0)",
  "rgba(220, 234, 55, 1.0)",
  "rgba(235, 206, 53, 1.0)",
  "rgba(234, 164, 62, 1.0)",
  "rgba(233, 123, 72, 1.0)",
  "rgba(217, 66, 114, 1.0)",
  "rgba(175, 46, 90, 1.0)",
  "rgba(147, 23, 78, 1.0)",
  "rgba(99, 20, 22, 1.0)",
  "rgba(43, 0, 1, 1.0)"
]);
colormap["sal00"] = interpolate([
  "#313695",
  "#4575b4",
  "#74add1",
  "#abd9e9",
  "#e0f3f8",
  "#ffffbf",
  "#fee090",
  "#fdae61",
  "#f46d43",
  "#d73027",
  "#a50026"
]);

colormap["sigma0"] = colormap["sal00"];
colormap["sigmat00"] = colormap["sal00"];

function getColor(value, type) {
  const rgba = colormap[type](value);
  const opacity = 0.8; // value < 0.5 ? 0.0 : value;
  const color = new GeoVis.Color(
    rgba[0] / 255,
    rgba[1] / 255,
    rgba[2] / 255,
    opacity
  );
  // const color = new GeoVis.Color(rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, 1.0)
  return color;
}

function removePoints() {
  if (allPoints !== undefined && allPoints.length > 1) {
    allPoints.forEach(point => {
      point.removeFrom(earth.features);
    }, this);
  }
  allPoints = [];
}

function removeLinepoints() {
  if (linePoints !== undefined && linePoints.length > 0) {
    linePoints.forEach(point => {
      point.removeFrom(earth.features);
    }, this);
  }
  linePoints = [];
}

function loadPoints(e) {
  const [data, type, depth, min, max, delta] = e.data;
  theType = type;
  valueMin = min;
  valueDelt = delta;
  data.map((item, index) => {
    const [x, y, z, rgba, lonlat] = item;
    const pos = new GeoVis.Vector3(x, y, z);
    const color = new GeoVis.Color(rgba[0], rgba[1], rgba[2], rgba[3]);
    var eachPoint = new GeoVis.Point(pos, {
      color, // : GeoVis.Color.fromRandom(),//WHITE,
      // outlineWidth: 0,
      // pixelSize: 12,
      scaleByDistance: new Engine.NearFarScalar(1.5e2, 1, 8.0e6, 1.5),
      pixelSize: 8 // parseInt(value * 25)
    }).addTo(earth.features);
    eachPoint.value = item.value;
    // console.log(item.value)
    eachPoint.lonlat = lonlat;
    allPoints.push(eachPoint);
  });

  // theType = type;
  // let min = data[0][type];
  // let max = min;
  // data.map(item => {
  //   min = min < item[type] ? min : item[type];
  //   max = max < item[type] ? item[type] : max;
  // });
  // valueMin = min;
  // let delta = max - min;
  // valueDelt = delta;
  // data.map((item, index) => {
  //   const value = (item[type] - min) / delta;
  //   const color = getColor(value, type);
  //   // const pointSize = value < 0.5 ? 5 : value * 25;
  //   // if(value<0.7) return
  //   var eachPoint = new GeoVis.Point(
  //     [
  //       parseFloat(item.longitude),
  //       parseFloat(item.latitude),
  //       5000 * 11 - 5000 * depth
  //     ],
  //     {
  //       color,
  //       pixelSize: 12 // parseInt(value * 25)
  //     }
  //   ).addTo(earth.features);
  //   eachPoint.value = item[type];
  //   allPoints.push(eachPoint);
  // });
}

export function changeDepth(depth) {
  removeLinepoints();
  var depthIndex = depth;
  allPoints.map(item => {
    if (item.lonlat[2] !== 5000 * 11 - 5000 * depthIndex) {
      // item.color.alpha = 0.2;
      item._primitive.show = false;
    } else {
      item._primitive.show = true;
    }
  });
}

export function showSelect(earth, obj) {
  earth.camera.flyTo({
    destination: GeoVis.Vector3.fromDegrees(132.3736, 20.9565, 752747),
    duration: 2,
    orientation: {
      heading: 5.493,
      pitch: -0.677,
      roll: 6.28
    }
  });
  removePoints();
  removeLinepoints();
  // alert("The option you select is:" + opt.text + "(" + opt.value + ")");
  var selectedV = obj;
  setTimeout(() => initCTD(selectedV, earth), 2000);
}

async function initCTD(type) {
  var worker = new Worker("../build/Workers/CTDWorker.js");
  worker.postMessage([type, 11]);
  worker.onmessage = loadPoints;
  // var depth = 0;
  // while (depth < 11) {
  //   const d = depth;
  //   $.ajax({
  //     url: `../../../data/seaLayer/cut/depth${depth}.json`,
  //     dataType: "json",
  //     success: data => {
  //       console.log(d);
  //       loadPoints(data, type, d, earth);
  //     }
  //   });
  //   depth++;
  // }
}

function Swap(A, i, j) {
  var temp = A[i];
  A[i] = A[j];
  A[j] = temp;
}

function BubbleSort(A, B, n) {
  for (
    var j = 0;
    j < n - 1;
    j++ // 每次最大元素就像气泡一样"浮"到数组的最后
  ) {
    for (
      var i = 0;
      i < n - 1 - j;
      i++ // 依次比较相邻的两个元素,使较大的那个向后移
    ) {
      if (A[i] > A[i + 1]) {
        // 如果条件改成A[i] >= A[i + 1],则变为不稳定的排序算法
        Swap(A, i, i + 1);
        Swap(B, i, i + 1);
      }
    }
  }
}

function showLine() {
  // ax+y = 0
  var originLon = lines[lines.length - 1]._positions[1][0];
  var originLat = lines[lines.length - 1]._positions[1][1];
  var l2Lon = lines[lines.length - 1]._positions[2][0];
  var l2Lat = lines[lines.length - 1]._positions[2][1];
  var l1 = new GeoVis.Vector3(originLon, originLat, 0);
  var l2 = new GeoVis.Vector3(l2Lon, l2Lat, 0);
  var a = -(l2Lat - originLat) / (l2Lon - originLon);
  var cameraLon = (earth.camera.positionCartographic.longitude * 180) / Math.PI;
  var cameraLat = (earth.camera.positionCartographic.latitude * 180) / Math.PI;
  var cameraVal = a * cameraLon + cameraLat;
  allPoints.map(item => {
    var lon = item.lonlat[0] - originLon;
    var lat = item.lonlat[1] - originLat;
    var val = a * lon + lat;
    var visible = cameraVal * val < 0;
    item._primitive.show = visible;
    var p = new GeoVis.Vector3(item.lonlat[0], item.lonlat[1], 0);
    var pDistance = calculateDistance(p, l1, l2);
    if (pDistance > 0.02) {
    } else {
      item._primitive.show = false;
      // console.log("push")
      // lineData.push([item.lonlat[2], item.value]);
      // linePos.push([item.lonlat[0], item.lonlat[1], item.value]);
    }
  });
  showLine2();
}
function showLine2() {
  var linePos = [];
  if (lines.length > 0) {
    var l1_Lon = lines[lines.length - 1]._positions[1][0];
    var l1_Lat = lines[lines.length - 1]._positions[1][1];
    var l2_Lon = lines[lines.length - 1]._positions[2][0];
    var l2_Lat = lines[lines.length - 1]._positions[2][1];
    var l1 = new GeoVis.Vector3(l1_Lon, l1_Lat, 0);
    var l2 = new GeoVis.Vector3(l2_Lon, l2_Lat, 0);
    //
    allPoints.map(item => {
      var p_Lon = item.lonlat[0];
      var p_Lat = item.lonlat[1];
      var p = new GeoVis.Vector3(p_Lon, p_Lat, 0);
      var pDistance = calculateDistance(p, l1, l2);
      // item._primitive.show = false;
      if (pDistance > 0.02) {
      } else {
        lineData.push([item.lonlat[2], item.value]);
        linePos.push([item.lonlat[0], item.lonlat[1], item.value]);
      }
    });

    var layerNum = linePos.length / 11;
    var lonMin = linePos[0][0];
    var latMin = linePos[0][1];
    var lonMax = linePos[0][0];
    var latMax = linePos[0][1];

    for (var i = 0; i < layerNum; i++) {
      // layerCon.push(linePos[i][0]);
      if (linePos[i][0] < lonMin) {
        lonMin = linePos[i][0];
        latMin = linePos[i][1];
      }
      if (linePos[i][0] > lonMax) {
        lonMax = linePos[i][0];
        latMax = linePos[i][1];
      }
    }
    var lonDelt = (lonMax - lonMin) / (1.0 * (layerNum - 1));
    var latDelt = (latMax - latMin) / (1.0 * (layerNum - 1));

    for (var l = 0; l < 9; l++) {
      var lonCon = [];
      var valueCon = [];
      for (var m = 0; m < layerNum; m++) {
        lonCon.push(linePos[l * layerNum + m][0]);
        valueCon.push(linePos[l * layerNum + m][2]);
      }
      BubbleSort(lonCon, valueCon, layerNum);
      for (var i = 0; i < layerNum; i++) {
        var value = valueCon[i]// ( - valueMin) / valueDelt;
        var color = getColor(value, theType);
        var eachPoint = new GeoVis.Point(
          [
            parseFloat(lonMin + i * lonDelt),
            parseFloat(latMin + i * latDelt),
            5000 * 11 - 5000 * l
          ],
          {
            color,
            pixelSize: 8 // parseInt(value * 25)
          }
        ).addTo(earth.features);
        linePoints.push(eachPoint);
      }
    }
  } else {
  }
}

export function resetPoints() {
  removeLinepoints();
  allPoints.map(item => {
    item._primitive.show = true;
  });
}

function calculateDistance(v, l1, l2) {
  var diff1 = new GeoVis.Vector3();
  var diff2 = new GeoVis.Vector3();
  var diff3 = new GeoVis.Vector3();
  var cross = new GeoVis.Vector3();
  GeoVis.Vector3.subtract(v, l1, diff1);
  GeoVis.Vector3.subtract(v, l2, diff2);
  GeoVis.Vector3.cross(diff1, diff2, cross);
  GeoVis.Vector3.subtract(l2, l1, diff3);
  return GeoVis.Vector3.magnitude(cross) / GeoVis.Vector3.magnitude(diff3);
}

function loadStation() {
  var stationPo;
  $.ajax({
    url: `./resource/stationInfo.json`,
    dataType: "json",
    async: false,
    success: data => {
      stationPo = data;
    }
  });

  stationPo.map(item => {
    var lon = item.lon;
    var lat = item.lat;
    var markerId = item.id.toString();
    var marker = new GeoVis.Billboard([lon, lat, 0], {
      image: "./data/markers/station2.png"
    }).addTo(earth.features);
    marker.id = "station&" + markerId;
    // marker._element.innerHTML = `<div class="marker-station" id=${markerId}> </div>`;
    markers.push(marker);
  });

  var tidePo = [
    { lat: 25.84917373892997, lon: 120.61076943929572 },
    { lat: 27.169912652957724, lon: 121.54870553415189 },
    { lat: 24.9057070070632, lon: 124.31719789105675 },
    { lat: 26.553471548075976, lon: 126.24707194249 },
    { lat: 30.437632261028508, lon: 122.77105389622116 },
    { lat: 29.36614683065887, lon: 125.09093224442647 },
    { lat: 29.377171692865964, lon: 128.82664193623933 },
    { lat: 27.3246711202747, lon: 122.88536415077441 }
  ];

  tidePo.map((item, index) => {
    var lon = item.lon;
    var lat = item.lat;
    var markerId = index + 1;
    var marker = new GeoVis.Billboard([lon, lat, 0], {
      image: "./data/markers/tide2.png"
    }).addTo(earth.features);
    marker.id = "tide&" + markerId;
    markers.push(marker);
  });
}
