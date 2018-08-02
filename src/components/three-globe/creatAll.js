import addOuterRing from "./addOuterRing";
import addLights from "./addLights";
import addTimeline from "./addTimeline";
import addEarth from "./addEarth";
import addTitle from "./addTitle";
import addSubtitle from "./addSubtitle";
import createHotSpot from "./createHotSpot";
import addEventListeners from "./addEventListeners";

import events from "./events";

export default function creatEarth(id, routeTo) {
  const objects = [];
  const isPortrait = true;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 1);
  const container = document.getElementById(id);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    1,
    100000
  );

  if (isPortrait) {
    camera.position.z = 700;
  } else {
    camera.position.z = 550;
  }
  const scene = new THREE.Scene();
  scene.rotation.set(0, 0, 0);
  const { dirLight1, dirLight2 } = addLights({ scene, camera });
  // add hotspot
  // const  hotspot_alt1=new THREE.Object3D()
  // const hotspot_alt2=new THREE.Object3D();

  // createAltHotSpot(hotspot_alt1, IDR.alt_events[0]);
  // createAltHotSpot(hotspot_alt2, IDR.alt_events[1]);
  const { timeline } = addTimeline({ scene, camera, objects });
  const outerRing = addOuterRing({ scene, camera, objects });
  const earth = addEarth({
    scene,
    camera,
    objects,
    dirLight1,
    dirLight2,
    outerRing
  });
  // const hotspot = createHotSpot({
  //   objects,
  //   earth
  // });
  addTitle({ scene, camera, objects });
  // const { title1, title2, title3, title4, title5 } = addSubtitle({ scene, camera, objects });
  addEventListeners({
    earth,
    scene,
    camera,
    objects,
    renderer,
    timeline,
    container,
    outerRing,
    // title1,
    // title2,
    // title3,
    // title4,
    // title5,
    routeTo
  });
  // let index = 0;
  // setInterval(() => {
  //   index++;
  //   index %= 18;
  //   hotspot.event_data = events[index];
  //   hotspot.show();
  // }, 1000);

  function render() {
    window.requestAnimationFrame(render);
    renderer.render(scene, camera);
    TWEEN.update();
    //   earth.rotation.y += 0.05;
    //   earth.rotation.x += 0.05;

    earth.rotation.x *= 0.005;
    earth.rotation.y -= Math.PI / 180 * 30 * 0.005;
    earth.rotation.z *= 0.005;
    timeline.outerDial.rotation.y += 0.001;
    timeline.dial.rotation.y += 0.001;
  }
  // setTimeout(()=>renderer.setSize(container.clientWidth, container.clientHeight),3000);
  render();
}
