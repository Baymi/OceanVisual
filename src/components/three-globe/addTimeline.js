export default function addTimeline(options) {
  // position and add timline
  const { scene, camera, objects } = options;
  let psize;
  let py;
  const timeline = new THREE.Object3D();
  timeline.dial = new THREE.Object3D();
  timeline.outerDial = new THREE.Object3D();
  timeline.title_line = new THREE.Object3D();
  timeline.pointer = new THREE.Object3D();
  timeline.add(timeline.dial);
  timeline.add(timeline.outerDial);
  timeline.add(timeline.title_line);
  timeline.add(timeline.pointer);
  const isPortrait = false;
  const r = 120;

  let mat = new THREE.LineBasicMaterial({
    linewidth: 1,
    color: 0x6fd5f0,
    transparent: true,
    opacity: 0.7
  });
  const t = 2 * Math.PI / 360;
  if (isPortrait) {
    psize = 3.0;
    py = 1.9;
  } else {
    psize = 2.4;
    py = 1.7;
  }

  // look for methods to merge geometyr instead of all these sepeate geos
  let lineGeo = new THREE.Geometry();
  let geo;
  for (let i = 0; i < 360; i++) {
    const x = r * Math.cos(t * i);
    const z = r * Math.sin(t * i);

    lineGeo.vertices.push(new THREE.Vector3(x * 0.985, 0, z * 0.985));
    lineGeo.vertices.push(new THREE.Vector3(x, 0, z));

    geo = new THREE.Geometry();
    lineGeo.vertices.push(new THREE.Vector3(x * 0.96, 0, z * 0.96));
    lineGeo.vertices.push(new THREE.Vector3(x * 0.965, 0, z * 0.965));
  }

  // now add all the lines as one piece of geometry
  let line = new THREE.LineSegments(lineGeo, mat);
  timeline.dial.add(line);

  // outer dial
  geo = new THREE.CylinderGeometry(r + 12, r + 12, 3, 200, 0, true);
  let material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.1,
    color: 0x6fd5f0,
    side: THREE.DoubleSide
  });

  let circle = new THREE.Mesh(geo, material);
  timeline.outerDial.add(circle);
  geo = new THREE.CylinderGeometry(r + 14, r + 14, 3, 200, 0, true);
  material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.2,
    color: 0x6fd5f0,
    side: THREE.DoubleSide
  });
  circle = new THREE.Mesh(geo, material);
  timeline.outerDial.add(circle);

  // add some radial lines to this
  lineGeo = new THREE.Geometry();
  mat = new THREE.LineBasicMaterial({
    linewidth: 4,
    transparent: true,
    opacity: 1,
    color: 0x6fd5f0
  });
  let x;
  let z;
  for (let i = 0; i < 360; i += 4) {
    x = (r + 12) * Math.cos(t * i);
    z = (r + 12) * Math.sin(t * i);
    // let geo = new THREE.Geometry();
    lineGeo.vertices.push(new THREE.Vector3(x * 1.07, 0, z * 1.07));
    lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
    // let line = new THREE.Line(geo, mat);
    // line.rotation.y=Math.PI/180 * 90;
    // timeline.outerDial.add(line);
  }

  // now add all the lines as one piece of geometry
  line = new THREE.LineSegments(lineGeo, mat);
  timeline.outerDial.add(line);

  // pointer object

  let s = new THREE.Shape();

  // can i smoooth out the absarc curve?
  s.absarc(0, 0, r, Math.PI / 180 * 85, Math.PI / 180 * -280.5, false);
  s.lineTo((r - 10) * Math.cos(t * 90), (r - 10) * Math.sin(t * 90));
  s.lineTo(r * Math.cos(t * 94.7), r * Math.sin(t * 94.7));
  // s.lineTo((r)*Math.cos(t*95),(r)*Math.sin(t*95));
  geo = new THREE.ShapeGeometry(s);
  mat = new THREE.LineBasicMaterial({
    linewidth: 1,
    transparent: true,
    opacity: 1,
    color: 0x6fd5f0
  });
  const tp = new THREE.Line(geo, mat);
  timeline.pointer.add(tp);
  timeline.pointer.rotation.x = Math.PI / 180 * -90;

  // add arrows to pointer
  // s = new THREE.Shape();
  // s.moveTo(-0.7, 0);
  // s.lineTo(0, -1.8);
  // s.lineTo(0.7, 0);
  // s.lineTo(-0.7, 0);

  // geo = new THREE.ShapeGeometry(s);
  // mat = new THREE.MeshLambertMaterial({
  //   transparent: true,
  //   opacity: 0.6,
  //   color: 0x7efa00,
  //   side: THREE.DoubleSide
  // });
  // const arrow = new THREE.Mesh(geo, mat);
  // arrow.position.y = 121;
  // const arrow2 = arrow.clone();
  // arrow2.rotation.z = Math.PI / 180 * 180;
  // arrow2.position.z -= 4;
  // arrow.position.z -= 0.2;
  // timeline.pointer.add(arrow);
  // timeline.pointer.add(arrow2);

  geo = new THREE.Geometry();
  geo.vertices.push(new THREE.Vector3(x * 0.96, 0, z * 0.96));
  geo.vertices.push(new THREE.Vector3(x * 0.99, 0, z * 0.99));
  line = new THREE.Line(geo, mat);
  timeline.dial.add(line);
  // position the whole timeline object
  if (isPortrait) {
    timeline.position.z = 660 - window.innerWidth * 0.01;
    timeline.position.y = -55 - window.innerWidth * 0.003;
  } else {
    timeline.position.z = 430 - window.innerWidth * 0.01;
    timeline.position.y = -55 - window.innerWidth * 0.003;
  }
  timeline.rotation.x = Math.PI / 180 * 5;

  // adjust the rotation of the dial to start
  timeline.dial.rotation.y = Math.PI / 180 * 80;
  timeline.outerDial.rotation.y = Math.PI / 180 * 80;

  scene.add(timeline);
  timeline.userData = { type: "timeline" };
  objects.push(timeline);
  // let pgeo = new THREE.PlaneGeometry(psize * 16.5, psize * 15.5);
  // let pmat = new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load("../resource/home/images/一带一路1.png"),
  //   transparent: true
  // });
  // // const p1 = new THREE.Mesh(pgeo, pmat);
  // p1.position.x = r * 1.1;
  // p1.position.z = -r * 0.79;
  // p1.position.y = -py * 3.2;
  // p1.lookAt(new THREE.Vector3(0, 0, -40));
  // // timeline.title_line.add(p1);

  // pgeo = new THREE.PlaneGeometry(psize * 16.5, psize * 15);
  // pmat = new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load("../resource/home/images/美丽中国1.png"),
  //   transparent: true
  // });
  // const p2 = new THREE.Mesh(pgeo, pmat);
  // p2.position.x = r * 1.15;
  // p2.position.z = -r * 0.5;
  // p2.position.y = -py * 1.55;
  // p2.lookAt(new THREE.Vector3(-20, 0, 0));
  // // timeline.title_line.add(p2);

  // pgeo = new THREE.PlaneGeometry(psize * 14, psize * 14.5);
  // pmat = new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load("../resource/home/images/生物多样性1.png"),
  //   transparent: true
  // });
  // const p3 = new THREE.Mesh(pgeo, pmat);
  // p3.position.x = r * 1.1;
  // p3.position.z = -r * 0.19;
  // p3.position.y = py * 1.65;
  // p3.lookAt(new THREE.Vector3(0, 0, 0));
  // // timeline.title_line.add(p3);

  // pgeo = new THREE.PlaneGeometry(psize * 15.5, psize * 14.5);
  // pmat = new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load("../resource/home/images/海洋信息1.png"),
  //   transparent: true
  // });
  // const p4 = new THREE.Mesh(pgeo, pmat);
  // // p.position.x = r*1.1*Math.cos(t*.35*(psize+.6));
  // // p.position.z = r*5*Math.sin(t*.35*(psize+.6));
  // // p.position.y = py*1.65;
  // p4.position.x = r * 1.13;
  // p4.position.z = 8.8;
  // p4.position.y = py * 1.65;
  // p4.lookAt(new THREE.Vector3(0, 0, 20));
  // // timeline.title_line.add(p4);

  // pgeo = new THREE.PlaneGeometry(psize * 15, psize * 14);
  // pmat = new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load("../resource/home/images/三级环境1.png"),
  //   transparent: true
  // });
  // const p5 = new THREE.Mesh(pgeo, pmat);
  // p5.position.x = r * 1.2;
  // p5.position.z = 41; /* (right) */
  // p5.position.y = py * 0.25;
  // p5.lookAt(new THREE.Vector3(20, 0, 50));
  // timeline.title_line.add(p5);

  // p1.userData = { type: "title1" };
  // p2.userData = { type: "title2" };
  // p3.userData = { type: "title3" };
  // p4.userData = { type: "title4" };
  // p5.userData = { type: "title5" };

  timeline.show = () => {
    const ypos = -55 - window.innerWidth * 0.003;
    const tween = new TWEEN.Tween(timeline.position)
      .to({ y: ypos }, 3000)
      .start();
    tween.easing(TWEEN.Easing.Quadratic.InOut);
  };
  timeline.hide = () => {
    const tween = new TWEEN.Tween(timeline.position)
      .to({ y: -200 }, 3000)
      .start();
    tween.easing(TWEEN.Easing.Quadratic.InOut);
  };
  return {
    timeline
    // p1,
    // p2,
    // p3,
    // p4,
    // p5
  };
}
