export default function addLights(options) {
  const { scene, camera } = options;
  const dirLight1 = new THREE.PointLight(0xd0fdff, 1.1, 0);
  dirLight1.position.set(0, 0, 600);
  dirLight1.lookAt(0, 0, 0);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x7efaff, 1);
  dirLight2.position.set(400, 400, 100);
  dirLight2.lookAt(camera);
  scene.add(dirLight2);
  return {
    dirLight1,
    dirLight2
  };
}
