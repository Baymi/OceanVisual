export default function addOuterRing(options) {
  const { scene } = options;
  const geo = new THREE.PlaneGeometry(480, 480, 1, 1);
  const mat = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(
      "../resource/home/images/radial_layers_medium.jpg"
    ),
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending
  });
  const outerRing = new THREE.Mesh(geo, mat);
  outerRing.position.z = 320;
  // outerRing.position.y = -50;
  // scene.add(outerRing);
  // outerRing.rotation.z=-2;
  scene.add(outerRing);
  outerRing.show = () => {
    const tween = new TWEEN.Tween(outerRing.position)
      .to({ z: 400 }, 3000)
      .start();
    tween.easing(TWEEN.Easing.Quadratic.InOut);
  };
  outerRing.hide = () => {
    const tween = new TWEEN.Tween(outerRing.position)
      .to({ z: 320 }, 3000)
      .start();
    tween.easing(TWEEN.Easing.Quadratic.InOut);
  };
  return outerRing;
}
