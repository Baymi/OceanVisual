/*  ADD HOTSPOT */
export default function createHotSpot({ objects, earth }) {
  const hotspot = new THREE.Object3D();
  const showingDetail = false;
  const radius = 160;
  let mat = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    color: 0xff8340,
    transparent: true,
    opacity: 0.6
  });

  // convert the positions from a lat, lon to a position on a sphere.
  function latLngToVector3(lat, lon, radius2) {
    const phi = lat * Math.PI / 180;
    const theta = (lon - 180) * Math.PI / 180;

    const x = -radius2 * Math.cos(phi) * Math.cos(theta);
    const y = radius2 * Math.sin(phi);
    const z = radius2 * Math.cos(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  }

  function addObjectAtLatLng(obj, lat, lng, height) {
    // heght is height from surface of earth
    if (!height) {
      height = 0;
    }
    const pos = latLngToVector3(lat, lng, radius + height);
    obj.position.set(pos.x, pos.y, pos.z);
    // obj.lookAt(earth.position);
    // instead look away :)
    const v = new THREE.Vector3();
    v.subVectors(obj.position, earth.position).add(obj.position);
    obj.lookAt(v);

    earth.add(obj);
  }


  const hexShape = new THREE.Shape();
  hexShape.moveTo(0, 10);
  hexShape.lineTo(9, 5);
  hexShape.lineTo(9, -5);
  hexShape.lineTo(0, -10);
  hexShape.lineTo(0, -6);
  hexShape.lineTo(5, -3);
  hexShape.lineTo(5, 3);
  hexShape.lineTo(0, 6);
  // hexShape.lineTo(0,10);

  let geo = new THREE.ShapeGeometry(hexShape);

  hotspot.hexSeg1 = new THREE.Mesh(geo, mat);
  hotspot.hexSeg2 = new THREE.Mesh(geo, mat);

  hotspot.add(hotspot.hexSeg1);
  hotspot.add(hotspot.hexSeg2);

  hotspot.hexSeg1.rotation.z = Math.PI / 180 * -60;
  hotspot.hexSeg2.rotation.z = Math.PI / 180 * 120;
  hotspot.hexSeg2.position.z = 3;

  const hexShape3 = new THREE.Shape();
  hexShape3.moveTo(0, 10);
  hexShape3.lineTo(9, 5);
  hexShape3.lineTo(9, -5);
  hexShape3.lineTo(0, -10);
  hexShape3.lineTo(-9, -5);
  hexShape3.lineTo(-9, 5);
  hexShape3.lineTo(0, 10);
  // hexShape3.lineTo(9,5);

  geo = new THREE.ShapeGeometry(hexShape3);
  mat = new THREE.LineBasicMaterial({
    blending: THREE.AdditiveBlending,
    linewidth: 2,
    color: 0xff8340,
    transparent: true,
    opacity: 0.8
  });
  hotspot.hexSeg3 = new THREE.Line(geo, mat);
  hotspot.add(hotspot.hexSeg3);
  hotspot.hexSeg3.position.z = 6;
  hotspot.hexSeg3.position.x = 0.25;

  hotspot.hexSeg3.scale.set(1.2, 1.2, 1.2);

  mat = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    color: 0xff8340,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });
  const hexShape4 = new THREE.Shape();
  hexShape4.moveTo(0, 10);
  hexShape4.lineTo(9, 5);
  hexShape4.lineTo(9, -5);
  hexShape4.lineTo(0, -10);
  hexShape4.lineTo(-9, -5);
  hexShape4.lineTo(-8, -4.5);
  hexShape4.lineTo(0, -9);
  hexShape4.lineTo(8, -4.5);
  hexShape4.lineTo(8, 4.5);
  hexShape4.lineTo(0, 9);
  // hexShape4.lineTo(0,10);

  geo = new THREE.ShapeGeometry(hexShape4);

  hotspot.hexSeg4 = new THREE.Mesh(geo, mat);
  hotspot.hexSeg4.scale.set(1.5, 1.5, 1.5);

  hotspot.add(hotspot.hexSeg4);

  hotspot.hexSeg4.position.z = 9;
  hotspot.hexSeg4.position.x = 0.4;

  // consider rebuilding this as 2 lines later
  // mght be more efficient than a shape??

  mat = new THREE.LineBasicMaterial({
    blending: THREE.AdditiveBlending,
    linewidth: 2,
    color: 0xff8340,
    transparent: true,
    opacity: 0.9
  });
  const plus = new THREE.Shape();
  plus.moveTo(0, 3);
  plus.lineTo(0, -3);
  plus.moveTo(0, 0);
  plus.lineTo(3, 0);
  plus.lineTo(-3, 0);
  geo = new THREE.ShapeGeometry(plus);
  hotspot.plus = new THREE.Line(geo, mat);
  hotspot.add(hotspot.plus);
  hotspot.plus.position.z = 12;
  hotspot.plus.position.x = 0;

  // merge to single geo later!!!!

  mat = new THREE.LineBasicMaterial({
    blending: THREE.AdditiveBlending,
    linewidth: 3,
    color: 0xff8340,
    transparent: true,
    opacity: 0.5
  });
  geo = new THREE.Geometry();
  geo.vertices.push(new THREE.Vector3(0, 0, 0));
  geo.vertices.push(new THREE.Vector3(5, 0, 0));
  hotspot.line = new THREE.Line(geo, mat);
  hotspot.add(hotspot.line);
  hotspot.line.position.z = 9;
  hotspot.line.position.x = 15;

  hotspot.line2 = new THREE.Line(geo, mat);
  hotspot.add(hotspot.line2);
  hotspot.line2.position.z = 9;
  hotspot.line2.position.x = -15;
  hotspot.line2.rotation.z = Math.PI / 180 * -180;

  hotspot.line3 = new THREE.Line(geo, mat);
  hotspot.add(hotspot.line3);
  hotspot.line3.position.z = 9;
  hotspot.line3.position.x = -10;
  hotspot.line3.position.y = 15;
  hotspot.line3.rotation.z = Math.PI / 180 * -60;

  hotspot.line4 = new THREE.Line(geo, mat);
  hotspot.add(hotspot.line4);
  hotspot.line4.position.z = 9;
  hotspot.line4.position.x = -10;
  hotspot.line4.position.y = -15;
  hotspot.line4.rotation.z = Math.PI / 180 * 240;

  hotspot.canvas = document.createElement("canvas");
  hotspot.canvas.width = 1024;
  hotspot.canvas.height = 256;
  hotspot.context = hotspot.canvas.getContext("2d");
  hotspot.context.font = "80px Borda-Bold";
  hotspot.context.fillStyle = "rgba(255,160,67,1)";
  hotspot.context.fillText("ABCDEFGHIJKLMNOPQRSTUVWXYZ&!", 0, 300);
  hotspot.context.font = "40px Borda-Bold";
  hotspot.context.fillText("0123456789.", 0, 200);
  hotspot.texture = new THREE.Texture(hotspot.canvas);
  // hotspot.texture.needsUpdate = true;
  hotspot.pMat = new THREE.MeshBasicMaterial({
    color: 0xff8340,
    blending: THREE.AdditiveBlending,
    map: hotspot.texture,
    side: THREE.DoubleSide,
    transparent: true
  });
  hotspot.title = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), hotspot.pMat);
  hotspot.title.position.x = 56;
  hotspot.title.position.y = -10;
  hotspot.add(hotspot.title);
  hotspot.canvas = null;

  // add the big line
  geo = new THREE.Geometry();
  geo.vertices.push(new THREE.Vector3(0, 0, 0));
  geo.vertices.push(new THREE.Vector3(0, 0, 250));
  mat = new THREE.LineBasicMaterial({
    blending: THREE.AdditiveBlending,
    color: 0xff8340,
    transparent: true,
    opacity: 0.5
  });
  const line = new THREE.Line(geo, mat);
  hotspot.add(line);

  // attach a big transparent click listener
  geo = new THREE.PlaneGeometry(50, 50, 1, 1);
  mat = new THREE.MeshBasicMaterial({
    color: 0xff8340,
    transparent: true,
    opacity: 0
  });
  hotspot.detector = new THREE.Mesh(geo, mat);
  hotspot.detector.position.z = 20;
  hotspot.add(hotspot.detector);

  // attach classes for listners
  hotspot.userData = { type: "hotspot" };
  hotspot.detector.userData = { type: "hotspot_target" };
  hotspot.hexSeg1.userData = { type: "hotspot_target" };
  hotspot.hexSeg2.userData = { type: "hotspot_target" };
  hotspot.hexSeg3.userData = { type: "hotspot_target" };
  hotspot.hexSeg4.userData = { type: "hotspot_target" };
  hotspot.plus.userData = { type: "hotspot_target" };
  hotspot.line.userData = { type: "hotspot_target" };
  hotspot.title.userData = { type: "hotspot_target" };
  hotspot.scale.set(2, 2, 2);

  hotspot.show = function a() {
    if (!showingDetail) {
      hotspot.remove(hotspot.title);
      hotspot.canvas = document.createElement("canvas");
      hotspot.canvas.id = "canvas1";
      hotspot.canvas.width = 1024;
      hotspot.canvas.height = 256;
      hotspot.context = hotspot.canvas.getContext("2d");
      hotspot.context.font = "76px Borda-Bold";
      hotspot.context.fillStyle = "rgba(255,160,67,1)";
      hotspot.context.fillText(hotspot.event_data.title.toUpperCase(), 0, 200);
      hotspot.context.font = "40px Borda-Bold";
      hotspot.context.fillText(hotspot.event_data.date, 10, 100);
      hotspot.texture = new THREE.Texture(hotspot.canvas);
      hotspot.pMat = new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        map: hotspot.texture,
        side: THREE.DoubleSide,
        transparent: true,
        color: 0xff8340
      });
      hotspot.title = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 20),
        hotspot.pMat
      );
      hotspot.texture.needsUpdate = true;
      hotspot.remove(hotspot.title);
      hotspot.title.position.x = 56;
      hotspot.title.position.y = 10;
      hotspot.add(hotspot.title);
      hotspot.title.userData = { type: "hotspot_target" };
      hotspot.canvas = null;

      addObjectAtLatLng(
        hotspot,
        hotspot.event_data.lat,
        hotspot.event_data.lng,
        18
      );


      const tween = new TWEEN.Tween(hotspot.scale)
        .to({ x: 1.7, y: 1.7, z: 1.7 }, 300)
        .start();
      tween.easing(TWEEN.Easing.Back.InOut);
    }
  };

  hotspot.hide = function b() {
    const tween = new TWEEN.Tween(hotspot.scale)
      .to({ x: 0.00001, y: 0.00001, z: 0.00001 }, 300)
      .start();
    tween.easing(TWEEN.Easing.Back.InOut);

    // $("#preview").removeClass("show");
  };

  // add hotspot to clickable collection
  objects.push(hotspot);
  return hotspot;
}
