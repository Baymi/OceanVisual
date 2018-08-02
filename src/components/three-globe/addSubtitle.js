export default function addSubtitle(options) {
  const { scene, camera, objects } = options;
  let pgeo = new THREE.PlaneGeometry(60, 45);
  let pmat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/一带一路.png"),
    transparent: true
  });
  /*
  const title1 = new THREE.Mesh(pgeo, pmat);
  title1.position.z = 320;
  title1.position.x = -95;
  title1.position.y = -70;

  scene.add(title1);
  pgeo = new THREE.PlaneGeometry(60, 45);
  pmat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/美丽中国.png"),
    transparent: true
  });
  const title2 = new THREE.Mesh(pgeo, pmat);
  title2.position.z = 320;
  title2.position.x = -48;
  title2.position.y = -70;

  scene.add(title2);
  pgeo = new THREE.PlaneGeometry(60, 45);
  pmat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/生物多样性.png"),
    transparent: true,
    opacity: 1
  });
  const title3 = new THREE.Mesh(pgeo, pmat);
  title3.position.z = 320;
  title3.position.x = 0;
  title3.position.y = -70;

  scene.add(title3);
  pgeo = new THREE.PlaneGeometry(60, 45);
  pmat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/海洋信息.png"),
    transparent: true
  });
  const title4 = new THREE.Mesh(pgeo, pmat);
  title4.position.z = 320;
  title4.position.x = 45;
  title4.position.y = -70;

  scene.add(title4);
  pgeo = new THREE.PlaneGeometry(60, 45);
  pmat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/三级环境.png"),
    transparent: true
  });
  const title5 = new THREE.Mesh(pgeo, pmat);
  title5.position.z = 320;
  title5.position.x = 93;
  title5.position.y = -70; */
  pgeo = new THREE.PlaneGeometry(42, 34);
  pmat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/一带一路.png"),
    transparent: true
  });
  const title1 = new THREE.Mesh(pgeo, pmat);
  title1.position.z = 380;
  title1.position.x = -67;
  title1.position.y = -52;

  scene.add(title1);

  pgeo = new THREE.PlaneGeometry(42, 34);
  pmat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/美丽中国.png"),
    transparent: true
  });
  const title2 = new THREE.Mesh(pgeo, pmat);
  title2.position.z = 380;
  title2.position.x = -34;
  title2.position.y = -52;

  scene.add(title2);
  pgeo = new THREE.PlaneGeometry(42, 34);
  pmat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/生物多样性.png"),
    transparent: true,
    opacity: 1
  });
  const title3 = new THREE.Mesh(pgeo, pmat);
  title3.position.z = 380;
  title3.position.x = 0;
  title3.position.y = -52;

  scene.add(title3);
  pgeo = new THREE.PlaneGeometry(42, 34);
  pmat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/海洋信息.png"),
    transparent: true
  });
  const title4 = new THREE.Mesh(pgeo, pmat);
  title4.position.z = 380;
  title4.position.x = 31;
  title4.position.y = -52;

  scene.add(title4);
  pgeo = new THREE.PlaneGeometry(42, 34);
  pmat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/三级环境.png"),
    transparent: true
  });
  const title5 = new THREE.Mesh(pgeo, pmat);
  title5.position.z = 380;
  title5.position.x = 65;
  title5.position.y = -52;

  scene.add(title5);
  title1.userData = { type: "title1" };
  title2.userData = { type: "title2" };
  title3.userData = { type: "title3" };
  title4.userData = { type: "title4" };
  title5.userData = { type: "title5" };
  objects.push(title1);
  objects.push(title2);
  objects.push(title3);
  objects.push(title4);
  objects.push(title5);
  return {
    title1,
    title2,
    title3,
    title4,
    title5
  };
}
