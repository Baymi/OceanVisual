var polygons = [];
var lines = [];
var allPoints = [];
var lineData = [];
var chartData = [];
var markers = [];
var selectedPos;
var theType;
var valueMin;
var valueDelt;



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

  if (lines !== undefined) {
    lines.forEach(line => {
      line.removeFrom(earth.features);
    }, this);
  }
  lines = [];
}

export function showBuoy(updateBuoy) {
  earth.camera.flyTo({
    destination: GeoVis.Vector3.fromDegrees(120.3736, 32.9565, 2252740),
    duration: 2
  });
  var buoyPo;
  var buoyId = 1;
  $.ajax({
    url: `./resource/buoy.json`,
    dataType: "json",
    async: false,
    success: data => {
      buoyPo = data;
    }
  });

  buoyPo.map(item => {
    var lon = item.lon;
    var lat = item.lat;
    var markerId = item.id.toString();
    var marker = new GeoVis.Marker([lon, lat, 0]).addTo(earth.features);
    marker._element.innerHTML = `<div class="buoy-station" id=${markerId}> </div>`;
    markers.push(marker);
  });

  $(".buoy-station").on("click", function () {
    // document.getElementById("stationContainer").style.display = "block";
    // document.getElementById("tideContainer").style.display = "none";
    console.log(this);
    $(".buoy-station").css('background', 'url(./resource/markers/buoy.png)  no-repeat');
    this.style.backgroundImage = "url(./resource/markers/buoypicked.png)";
    buoyId = Number(this.id);
    updateBuoy(buoyId);
  });

}


