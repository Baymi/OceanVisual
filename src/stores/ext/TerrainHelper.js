const { GeoVis, Engine } = window;
// 添加谷歌影像
export function createImgLayer(earth) {
  var layer = new GeoVis.TileLayer(
    "http://geovisweb.oss-cn-shanghai.aliyuncs.com/tiles/googleimg/{z}/{x}/{y}",
    {
      projection: "EPSG:900913"
    }
  ).addTo(earth.layers);
  return layer;
}

export function createMapLayer(earth) {
  var layer = new GeoVis.TileLayer(
    "http://geovisweb.oss-cn-shanghai.aliyuncs.com/tiles/googlemap/{z}/{x}/{y}",
    {
      projection: "EPSG:900913"
    }
  ).addTo(earth.layers);
  return layer;
}

// Geoserver Bil地形
export function createServerBilTerrain(options) {
  const {
    scale = 1,
    landScale = 1,
    oceanScale = 1,
    waterMask = false
  } = options;
  var terrainProvider = new GeoVis.GeoserverTerrainProvider({
    url: "http://localhost:8080/geoserver/wms",
    layerName: "GlobalTerrain:pyramid32",
    maxLevel: 10,
    service: "WMS",
    lowest: -300000,
    hasStyledImage: false,
    scale: scale, // 放大倍数
    waterMask: waterMask,
    formatImage: { format: "image/bil", extension: "bil" },
    formatArray: {
      format: "image/bil",
      postProcessArray: function(bufferIn, size, highest, lowest, offset) {
        var resultat;
        var viewerIn = new DataView(bufferIn);
        var littleEndianBuffer = new ArrayBuffer(size.height * size.width * 4);
        var viewerOut = new DataView(littleEndianBuffer);
        if (littleEndianBuffer.byteLength === bufferIn.byteLength) {
          var temp;
          var goodCell = 0;
          var somme = 0;
          for (var i = 0; i < littleEndianBuffer.byteLength; i += 4) {
            temp = viewerIn.getFloat32(i, false) - offset;
            if (temp > lowest && temp < highest) {
              temp = temp > 0 ? temp * landScale : temp * oceanScale;
              viewerOut.setFloat32(i, temp, true);
              somme += temp;
              goodCell++;
            } else {
              var val = goodCell == 0 ? 1 : somme / goodCell;

              viewerOut.setFloat32(i, val, true);
            }
          }
          resultat = new Float32Array(littleEndianBuffer);
        }
        return resultat;
      }
    }
  });
  return terrainProvider;
}

export function createTerrainLayer(earth) {
  var layer = new GeoVis.WMSLayer(
    "http://localhost:8080/geoserver/gwc/service/wms",
    {
      parameters: {
        srs: "EPSG:4326",
        styles: "GlobalTerrain:terrainTest1",
        tb: "tilebase",
        bbox: "{westDegrees},{southDegrees},{eastDegrees},{northDegrees}"
      },
      layers: "GlobalTerrain:TerrainMap",
      projection: "EPSG:4326",
      name: "地形图ETOP"
    }
  ).addTo(earth.layers);
  return layer;
}

export function createInfobox() {
  var hand = new Engine.ScreenSpaceEventHandler(earth.canvas);
  var info = document.getElementById("info");
  // return altitude with double click in console.log!!
  hand.setInputAction(function(movement) {
    var scene = earth.scene;
    var ellipsoid = scene.globe.ellipsoid;
    var globe = scene.globe;
    if (movement.endPosition != null) {
      var cartesian = scene.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid
      );
      if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        cartographic.height = globe.getHeight(cartographic) || 0;
        info.innerText = `经度${(
          (cartographic.longitude * 180) /
          Math.PI
        ).toFixed(4)} °; 纬度 ${(
          (cartographic.latitude * 180) /
          Math.PI
        ).toFixed(4)}°;  高度=${(
          cartographic.height / GeoVis.GeoserverTerrainProvider.heightScale
        ).toFixed(0)} m`;
      }
    }
  }, Engine.ScreenSpaceEventType.MOUSE_MOVE);

  hand.setInputAction(function(movement) {
    var scene = earth.scene;
    var ellipsoid = scene.globe.ellipsoid;
    var globe = scene.globe;
    if (movement.position != null) {
      var cartesian = scene.camera.pickEllipsoid(movement.position, ellipsoid);
      if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        cartographic.height = globe.getHeight(cartographic);
        console.log(
          "[" +
            (cartographic.latitude * 180) / Math.PI +
            "," +
            (cartographic.longitude * 180) / Math.PI +
            ",],"
        );
      }
    }
  }, Engine.ScreenSpaceEventType.LEFT_CLICK);
}

export function applyWaterMaterial(primitive) {
  // Sandcastle.declare(applyWaterMaterial); // For highlighting in Sandcastle.

  primitive.appearance.material = new Engine.Material({
    translucent: true,
    fabric: {
      type: "Water",
      uniforms: {
        specularMap: "./resource/waterData/earthspec1k.jpg",
        normalMap: "./resource/waterData/waterNormals.jpg",
        frequency: 10000.0,
        animationSpeed: 0.01,
        amplitude: 20.0
      }
    }
  });
}

export function createWatermask(earth) {
  var worldRectangle = earth.scene.primitives.add(
    new Engine.Primitive({
      geometryInstances: new Engine.GeometryInstance({
        geometry: new Engine.RectangleGeometry({
          rectangle: Engine.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
          vertexFormat: Engine.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        })
      }),
      appearance: new Engine.EllipsoidSurfaceAppearance({
        aboveGround: false,
        fragmentShaderSource:
          "varying vec3 v_positionMC;\nvarying vec3 v_positionEC;\nvarying vec2 v_st;\nvoid main()\n{\nczm_materialInput materialInput;\nvec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n#ifdef FACE_FORWARD\nnormalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n#endif\nmaterialInput.s = v_st.s;\nmaterialInput.st = v_st;\nmaterialInput.str = vec3(v_st, 0.0);\nmaterialInput.normalEC = normalEC;\nmaterialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\nvec3 positionToEyeEC = -v_positionEC;\nmaterialInput.positionToEyeEC = positionToEyeEC;\nczm_material material = czm_getMaterial(materialInput);\n#ifdef FLAT\ngl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n#else\ngl_FragColor = czm_phong(normalize(positionToEyeEC), material);gl_FragColor.a=0.4 * material.alpha;\n#endif\n}\n" // 重写shader，修改水面的透明度
      }),
      show: true
    })
  );

  applyWaterMaterial(worldRectangle);
  return worldRectangle;
}

class CameraPos {}
CameraPos.packedLength = 6;
CameraPos.pack = function(value, array, startingIndex) {
  value.map(e => {
    array.push(e);
  });
  return array;
};
CameraPos.unpack = function(array, startingIndex, result) {
  result = result || [];
  let i = startingIndex;
  result.push(array[i++]);
  result.push(array[i++]);
  result.push(array[i++]);
  result.push(array[i++]);
  result.push(array[i++]);
  result.push(array[i]);
  return result;
};
export function track(routes, earth, clock) {
  clock.startTime = GeoVis.Date.fromDate(new Date("2017/1/1"));
  clock.stopTime = GeoVis.Date.fromDate(new Date("2017/2/1"));
  const startTime = (clock.currentTime = clock.startTime);
  clock.multiplier = 1;
  clock.canAnimate = true;
  clock.shouldAnimate = true;
  const property = new Engine.SampledProperty(CameraPos);
  property.setInterpolationOptions({
    interpolationAlgorithm: Engine.LagrangePolynomialApproximation
  });
  const times = routes.map((e, i) => {
    let date = new GeoVis.Date();
    return GeoVis.Date.addMinutes(startTime, i * 4, date);
  });
  property.addSamples(times, routes);
  function tick() {
    clock.tick();
    const time = clock.currentTime;
    const state = property.getValue(time);
    const [lon, lat, height, heading, pitch, roll] = state;
    if (!lon) return;
    earth.camera.setView({
      destination: GeoVis.Vector3.fromDegrees(lon, lat, height),
      orientation: {
        heading: GeoVis.Math.toRadians(heading), // east, default value is 0.0 (north)
        pitch: GeoVis.Math.toRadians(pitch), // default value (looking down)
        roll: GeoVis.Math.toRadians(roll) // default value
      }
    });
    const inRange = GeoVis.Date.compare(times[times.length - 1], time);
    if (!inRange) {
      console.log("关闭监听");
      earth.off("tick", tick);
    }
  }
  earth.on("tick", tick);
}

export function createViewingLayer(earth, layer) {
  if (layer.type === "single") {
    const { url, rec } = layer;
    const rectangle = Engine.Rectangle.fromDegrees(...rec);
    return new GeoVis.SingleLayer(url, { rectangle }).addTo(earth.layers);
  }
}
