export default function addEarth(options) {
  const { scene, objects, outerRing } = options;
  // add eaerth container
  const earthContainer = new THREE.Object3D();
  const radius = 160;
  // let earthShow = true;
  earthContainer.rotation.x = Math.PI / 180 * 10;
  earthContainer.rotation.z = Math.PI / 180 * -20;
  earthContainer.rotation.y = Math.PI / 180 * -20;
  let geo = new THREE.SphereGeometry(radius, 50, 50);
  let mat = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/earth.jpg")
  });
  const earth = new THREE.Mesh(geo, mat);
  earthContainer.add(earth);

  geo = new THREE.SphereGeometry(radius + 15, 40, 30);
  mat = new THREE.MeshLambertMaterial({
    transparent: true,
    color: 0x2ac7cc,
    blending: THREE.AdditiveBlending,

    opacity: 0.4
  });
  const egh = new THREE.EdgesHelper(new THREE.Mesh(geo, mat), 0x2ac7cc);
  egh.material.linewidth = 0.5;
  egh.material.transparent = true;
  egh.material.opacity = 0.08;
  earth.add(egh);

  geo = new THREE.SphereGeometry(radius + 15, 20, 30);
  mat = new THREE.MeshLambertMaterial({
    transparent: true,
    color: 0x2ac7cc,
    blending: THREE.AdditiveBlending,
    opacity: 0.8
  });
  const egh1 = new THREE.EdgesHelper(new THREE.Mesh(geo, mat), 0x2ac7cc);
  egh1.material.linewidth = 0.5;
  egh1.material.transparent = true;
  egh1.material.opacity = 0.15;
  earth.add(egh1);

  geo = new THREE.SphereGeometry(radius + 15, 50, 50);
  mat = new THREE.MeshLambertMaterial({
    blending: THREE.AdditiveBlending,
    transparent: true,
    color: 0x2ac7cc,
    opacity: 0.6,
    map: new THREE.TextureLoader().load(
      "../resource/home/images/earth_political_alpha.png"
    )
  });
  const earthPol = new THREE.Mesh(geo, mat);
  earth.add(earthPol);
  const ep2 = earthPol.clone();
  earth.add(ep2);

  // add earth orbital ring
  earth.ring = new THREE.Object3D();
  const r = radius + 60;
  const t = Math.PI / 180 * 2;
  mat = new THREE.LineBasicMaterial({
    linewidth: 0.5,
    color: 0x6fd5f0,
    transparent: true,
    //depthTest : 1,
    opacity: 0.4
  });

  const lineGeo = new THREE.Geometry();
  for (let i = 0; i < 180; i++) {
    const x = r * Math.cos(t * i);
    const z = r * Math.sin(t * i);

    lineGeo.vertices.push(new THREE.Vector3(x * 0.985, 0, z * 0.985));
    lineGeo.vertices.push(new THREE.Vector3(x, 0, z));

    if (i % 5 === 0) {
      lineGeo.vertices.push(new THREE.Vector3(x * 0.965, 0, z * 0.965));
      lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
      lineGeo.vertices.push(new THREE.Vector3(x * 0.965, 0, z * 0.965));
      lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
    }

    if (Math.floor(Math.random() * 10 + 1) === 1) {
      lineGeo.vertices.push(new THREE.Vector3(x, 0, z));
      lineGeo.vertices.push(new THREE.Vector3(x, 5, z));
    }
  }

  // now add all the lines as one piece of geometry
  const line = new THREE.LineSegments(lineGeo, mat);

  earth.ring.add(line);
  earth.add(earth.ring);

  scene.add(earthContainer);

  ep2.userData = { type: "earth" };
  earth.userData = { type: "earth" };
  earthPol.userData = { type: "earth" };

  egh.userData = { type: "earth" };
  egh1.userData = { type: "earth" };
  objects.push(earth);

  earth.show = () => {
    console.log("earth.show");
    const ypos = 75 + window.innerWidth * 0.003;
    const tween = new TWEEN.Tween(earth.position)
      .to({ x: 25, y: 24, z: ypos }, 3000)
      .start();
    tween.easing(TWEEN.Easing.Quadratic.InOut);
    earth.remove(earth.ring);
    earth.remove(ep2);
    earth.remove(egh);
    earth.remove(egh1);
    earth.remove(earthPol);
    earthShow = true;
  };
  earth.ringshow = () => {
    // console.log("earth.show");

    const tween = new TWEEN.Tween(earth.position)
      .to(
        {
          x: Math.PI / 180 * 10,
          y: Math.PI / 180 * -20,
          z: Math.PI / 180 * -20
        },
        3000
      )
      .start();
    tween.easing(TWEEN.Easing.Quadratic.InOut);
    earthShow = true;
  };

  earth.hide = () => {
    // console.log("../resource/home/images/earth.jpg");
    const tween = new TWEEN.Tween(earth.position)
      .to(
        {
          x: earthContainer.rotation.x + 500,
          y: earthContainer.rotation.y,
          z: earthContainer.rotation.z
        },
        3000
      )
      .start();
    tween.easing(TWEEN.Easing.Quadratic.InOut);
    earth.add(earth.ring);
    earth.add(ep2);
    earth.add(egh);
    earth.add(egh1);
    earth.add(earthPol);
    // earth.material.map.image.src = "../resource/home/images/earth.jpg";
    earth.add(earth.ring);
    earth.add(ep2);
    earth.add(egh);
    earth.add(egh1);
    earth.add(earthPol);
    scene.remove(outerRing);
    earthShow = false;
  };
  return earth;
}
