export default function addEventListeners(options) {
  // listen for resize
  const {
    earth,
    camera,
    renderer,
    timeline,
    objects,
    container,
    outerRing,
    title1,
    title2,
    title3,
    title4,
    title5,
    routeTo
  } = options;
  let isPortrait = false;
  const showingDetail = false;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;
  let targetRotationX = Math.PI / 180 * -91;
  let targetRotationOnMouseDownX = 0;
  let targetRotationY = 0;
  const targetRotationOnMouseDownY = 0;
  let targetEarthRotationX = 0;
  const targetEarthRotationOnMouseDownX = 0;
  let targetEarthRotationY = 0;
  const targetEarthRotationOnMouseDownY = 0;
  let targetSceneRotationY = 0;
  let targetSceneRotationX = 0;
  let mouseX = 0;
  let mouseXOnMouseDown = 0;
  let mouseY = 0;
  let mouseYOnMouseDown = 0;
  let grabbedTimeline = false;
  let grabbedEarth = false;
  const earthShow = true;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  function onWindowResize() {
    console.log("got resize event");
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    if (window.innerWidth < window.innerHeight) {
      camera.position.z = 700;
      // adjust timeline
      if (timeline) {
        timeline.position.z = 670 - window.innerWidth * 0.01;
        if (!showingDetail) {
          timeline.position.y = -60 - window.innerWidth * 0.003;
        }
      }
    } else {
      isPortrait = false;
      camera.position.z = 550;
      if (timeline) {
        // adjust timeline
        timeline.position.z = 530 - window.innerWidth * 0.01;
        if (!showingDetail) {
          timeline.position.y = -55 - window.innerWidth * 0.003;
        }
      }
    }
  }
  window.addEventListener("resize", onWindowResize, false);

  onWindowResize();

  // let isMove = true;
  // document.onmousedown = function mousedown(e) {
  //   isMove = false;
  //   mouseXOnMouseDown = e.clientX - windowHalfX;
  //   mouseYOnMouseDown = e.clientY - windowHalfY;
  //   targetEarthRotationOnMouseDownX = targetEarthRotationX;
  //   targetEarthRotationOnMouseDownY = targetEarthRotationY;
  // };
  // document.onmousemove = function rt(e) {
  //   if (!isMove) {
  //     targetEarthRotationY =
  //       targetEarthRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.005;
  //     targetEarthRotationX =
  //       targetEarthRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.005;
  //     earth.rotation.y += (targetEarthRotationX - earth.rotation.y) * 0.05;
  //     earth.rotation.x += (targetEarthRotationY - earth.rotation.x) * 0.05;
  //   }
  // };
  // document.onmouseup = function mouseup() {
  //   isMove = true;
  // };

  // mouse click
  function onDocumentMouseDown(event) {
    // console.log("5555555");

    mouseXOnMouseDown = event.clientX - windowHalfX;
    mouseYOnMouseDown = event.clientY - windowHalfY;

    // check for clicks
    mouse.x = event.clientX / renderer.domElement.clientWidth * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects, true);

    grabbedEarth = false;
    grabbedTimeline = false;
    if (intersects.length > 0) {
      if (intersects[0].object.userData.type === "title1") {
        // 页面切换
        // title_line.hide();
        // timeline.hide();
        // title.hide();
        // earth.show();
        // outerRing.show();
        // document.body.style.cursor = "pointer";
      }
      if (intersects[0].object.userData.type === "title2") {
        // console.log("美丽中国~~~")
        location.replace("/china");
        // title_line.hide();
        // timeline.hide();
        // title.hide();
        // `earth.material.map.image.src `= "../resource/home/images/history.jpg";
        // // earth1.material.map.image.src = "../resource/home/images/history.jpg";
        // earth.show();
        // outerRing.show();
        // // document.body.style.cursor = "pointer";
      }

      // if (
      //   intersects[0].object.userData.type == "earth" ||
      //   intersects[0].object.parent.userData.type == "earth" ||
      //   intersects[0].object.parent.parent.userData.type == "earth"
      // ) {
      //   grabbedEarth = true;
      //   timeline.show();
      // }

      // if (
      //   intersects[0].object.userData.type == "timeline" ||
      //   intersects[0].object.parent.userData.type == "timeline" ||
      //   intersects[0].object.parent.parent.userData.type == "timeline"
      // ) {
      //   targetRotationOnMouseDownX = targetRotationX;
      //   grabbedTimeline = true;
      //   // if (mode == "play" && speechPlaying) {
      //   //   pauseSpeech();
      //   // }
      //   console.log("timeline grabbed");
      // }
    }
  }
  document.addEventListener("mousedown", onDocumentMouseDown, false);
  // // drag with mouse
  function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

    if (grabbedTimeline) {
      targetRotationY =
        targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.002;
      targetRotationX =
        targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.003;
    }

    if (grabbedEarth) {
      targetEarthRotationY =
        targetEarthRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.005;
      targetEarthRotationX =
        targetEarthRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.005;
    }

    mouse.x = event.clientX / renderer.domElement.clientWidth * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects, true);

    document.body.style.cursor = "default";
    // if (intersects.length > 0) {
    //   if (
    //     intersects[0].object.userData.type === "earth" ||
    //     intersects[0].object.parent.userData.type === "earth"
    //   ) {
    //     document.body.style.cssText =
    //       "cursor: -moz-grab; cursor: -webkit-grab; cursor: grab;";
    //     // earth.rotation.x = mouse.x;
    //     // earth.rotation.y= mouse.y;
    //   }
    //   if (intersects[0].object.userData.type === "title1") {
    //     document.body.style.cursor = "pointer";

    //   } else {
    //     // title1.rotation.z = 0;
    //   }

    //   if (intersects[0].object.userData.type === "title2") {
    //     document.body.style.cursor = "pointer";
    //     title2.rotation.z = -25;
    //   } else {
    //     title2.rotation.z = 0;
    //   }

    //   if (intersects[0].object.userData.type === "title3") {
    //     document.body.style.cursor = "pointer";
    //     title3.rotation.z = -25;
    //   } else {
    //     title3.rotation.z = 0;
    //   }

    //   if (intersects[0].object.userData.type === "title4") {
    //     document.body.style.cursor = "pointer";
    //     title4.rotation.z = 25;
    //   } else {
    //     title4.rotation.z = 0;
    //   }

    //   if (intersects[0].object.userData.type === "title5") {
    //     document.body.style.cursor = "pointer";
    //     title5.rotation.z = 25;
    //   } else {
    //     title5.rotation.z = 0;
    //   }
    // }
  }
  document.addEventListener("mousemove", onDocumentMouseMove, false);
  // // mouse / touch up
  function onDocumentMouseUp(event) {
    // document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener("mouseup", onDocumentMouseUp, false);
    document.removeEventListener("mouseout", onDocumentMouseOut, false);
    if (grabbedTimeline) {
      // finishedDrift = false;
    }
    grabbedEarth = false;
    grabbedTimeline = false;
    document.removeEventListener("touchend", onDocumentMouseUp, false);
  }

  // mouse / touch out
  function onDocumentMouseOut(event) {
    // document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener("mouseup", onDocumentMouseUp, false);
    document.removeEventListener("mouseout", onDocumentMouseOut, false);
    if (grabbedTimeline) {
      finishedDrift = false;
    }
    grabbedEarth = false;
    grabbedTimeline = false;
  }
  window.onDocumentMouseMoveDetail = function documentMouseMoveDetail(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
    // if showing detail view add some parrllax
    if (showingDetail) {
      targetSceneRotationY = -mouseX * 0.00007;
      targetSceneRotationX = -mouseY * 0.0001;
    }
  };

  // need gyro equivelent for mobile
}
