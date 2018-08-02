export default function addTitle(options) {
  const { scene, camera, objects } = options;
  const geo = new THREE.PlaneGeometry(150, 20, 1, 1);
  const mat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("../resource/home/images/海洋标题.png"),
    transparent: true
  });
  const title = new THREE.Mesh(geo, mat);
  title.position.z = 320;
  title.position.y = 80;
  // outerRing.position.y = -50;
  scene.add(title);
  title.hide = () => {
    const tween = new TWEEN.Tween(title.position).to({ y: 200 }, 3000).start();
    tween.easing(TWEEN.Easing.Quadratic.InOut);
  };
  title.show = () => {
    const tween = new TWEEN.Tween(title.position).to({ y: 80 }, 3000).start();
    tween.easing(TWEEN.Easing.Quadratic.InOut);
  };
  // outerRing.rotation.z=-2;
}
