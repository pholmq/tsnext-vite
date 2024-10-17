import { useEffect, useLayoutEffect, useRef } from "react";
import { CameraHelper, Vector3 } from "three";

import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, useHelper } from "@react-three/drei";

import { useGesture } from "@use-gesture/react";

import useKeyPress from "../utils/useKeyPress";
import { useStore } from "../store";
import Arrow from "../utils/Arrow";
import Ballrod from "../utils/Ballrod";

/*2024-10-14 Weird bug/problem
It seems that the cameras up/down is only maintained properly when the camera
is active, which means that when it's moved in the system camera view it's 
up/down is messed up.
*/
/*2024-10-15 Solved! By rewriting the camera system. Short story if the default canvas camera is 
  used and connected to Drei Camera controls, weird things happen. So I made a new SystemCamera component
  with a PerspectiveCamera camera as default
  */
export default function PlanetCamera({ planetRadius }) {
  let cameraHeight = planetRadius + 0.1;
  const longitude = 0;
  const latitude = 0;
  const planetCamRef = useRef(null);
  const camBoxRef = useRef(null);
  const longAxisRef = useRef(null);
  const latAxisRef = useRef(null);
  const camMountRef = useRef(null);
  const keyPressed = useKeyPress();

  const { camera, gl } = useThree();
  const planetCamera = useStore((s) => s.planetCamera);
  const planetCameraHelper = useStore((s) => s.planetCameraHelper);
  const cameraTarget = useStore((s) => s.cameraTarget);

  useEffect(() => {
    loadCameraPosition();
    planetCamRef.current.updateProjectionMatrix();
  }, [cameraTarget]);

  function loadCameraPosition() {
    const planetCameraDirection = useStore.getState().planetCameraDirection;
    planetCamRef.current.rotation.y =
      planetCameraDirection.camRotationy + Math.PI;
    planetCamRef.current.rotation.x = planetCameraDirection.camRotationx;
    planetCamRef.current.fov = planetCameraDirection.camFov;
    latAxisRef.current.rotation.x =
      planetCameraDirection.latRotationx - Math.PI / 2;
    longAxisRef.current.rotation.y =
      planetCameraDirection.longRotationy - Math.PI / 2;
  }

  function saveCameraPosition() {
    useStore.setState((s) => ({
      planetCameraDirection: {
        camRotationy: planetCamRef.current.rotation.y - Math.PI,
        camRotationx: planetCamRef.current.rotation.x,
        camFov: planetCamRef.current.fov,
        latRotationx: latAxisRef.current.rotation.x + Math.PI / 2,
        longRotationy: longAxisRef.current.rotation.y + Math.PI / 2,
        // camMountPosy: camMountRef.current.position.y,
      },
    }));
    const planetCameraDirection = useStore.getState().planetCameraDirection;
    // console.log(planetCameraDirection);
  }

  useHelper(
    //Only show helper if planetCamera is not active
    planetCameraHelper && !planetCamera ? planetCamRef : false,
    CameraHelper
  );

  //Set touch action to none so useGesture doesn't complain
  gl.domElement.style.touchAction = "none";
  useGesture(
    {
      onDrag: planetCamera //If planetCamera is true, then we hand it a function
        ? ({ delta: [dx, dy] }) => {
            //Multiplute by fov to make the movement less sensitive when we're zoomed in
            const sensitivity = 0.0001 * planetCamRef.current.fov;
            planetCamRef.current.rotation.y += dx * sensitivity;
            let camRotationX =
              planetCamRef.current.rotation.x + dy * sensitivity;
            if (camRotationX > Math.PI / 2) camRotationX = Math.PI / 2;
            if (camRotationX < -Math.PI / 2) camRotationX = -Math.PI / 2;
            planetCamRef.current.rotation.x = camRotationX;
            camBoxRef.current.rotation.y = planetCamRef.current.rotation.y;
            camBoxRef.current.rotation.x = planetCamRef.current.rotation.x;
            saveCameraPosition();
          }
        : () => {}, // and if not, it gets and empty function

      onWheel: planetCamera
        ? ({ delta: [, dy] }) => {
            //
            const sensitivity = 0.01;
            const fov = planetCamRef.current.fov + dy * sensitivity;

            if (fov > 0 && fov < 120) {
              planetCamRef.current.fov = fov;
              planetCamRef.current.updateProjectionMatrix();
            }
            saveCameraPosition();
          }
        : () => {},
    },
    {
      target: gl.domElement,
      eventOptions: { passive: false },
    }
  );
  let latRotationX;
  let camRotationX;
  useFrame(() => {
    if (keyPressed) {
      latRotationX = latAxisRef.current.rotation.x;
    }
    switch (keyPressed) {
      case "w":
        latRotationX += 0.05;
        break;
      case "s":
        latRotationX -= 0.05;
        break;
      case "a":
        longAxisRef.current.rotation.y -= 0.05;
        break;
      case "d":
        longAxisRef.current.rotation.y += 0.05;
        break;
      case "q":
        camMountRef.current.position.y += 0.05;
        break;
      case "e":
        if (camMountRef.current.position.y >= planetRadius + 0.1) {
          camMountRef.current.position.y -= 0.05;
        }
        break;
    }

    if (keyPressed === "PageUp") {
      if (planetCamRef.current.fov > 0.5) {
        planetCamRef.current.fov -= 0.5;
        planetCamRef.current.updateProjectionMatrix();
      }
    }
    if (keyPressed === "PageDown") {
      if (planetCamRef.current.fov < 120) {
        planetCamRef.current.fov += 0.5;
        planetCamRef.current.updateProjectionMatrix();
      }
    }
    //Multiplute by fov to make the movement less sensitive when we're zoomed in
    const rotationFact = 0.001 * planetCamRef.current.fov;
    camRotationX = planetCamRef.current.rotation.x;
    switch (keyPressed) {
      case "ArrowUp":
        camRotationX += rotationFact;
        break;
      case "ArrowDown":
        camRotationX -= rotationFact;
        break;
      case "ArrowLeft":
        planetCamRef.current.rotation.y += rotationFact;
        break;
      case "ArrowRight":
        planetCamRef.current.rotation.y -= rotationFact;
        break;
    }

    if (keyPressed) {
      if (latRotationX > 0) latRotationX = 0;
      if (latRotationX < -Math.PI) latRotationX = -Math.PI;

      latAxisRef.current.rotation.x = latRotationX;
      if (camRotationX > Math.PI / 2) camRotationX = Math.PI / 2;
      if (camRotationX < -Math.PI / 2) camRotationX = -Math.PI / 2;
      planetCamRef.current.rotation.x = camRotationX;

      camBoxRef.current.rotation.y = planetCamRef.current.rotation.y;
      camBoxRef.current.rotation.x = planetCamRef.current.rotation.x;
      saveCameraPosition();
    }
  });

  return (
    <>
      {/* We put the camera system in a group and rotate it so that lat and long are at 0 */}
      <group ref={longAxisRef}>
        <group ref={latAxisRef}>
          <group ref={camMountRef} position={[0, cameraHeight, 0]}>
            <group
              ref={camBoxRef}
              rotation={[0, Math.PI, 0]}
              rotation-order={"YXZ"}
              // show the box if planetcamera is not active and show camera pos is on
              visible={!planetCamera && planetCameraHelper}
            >
              <mesh>
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshStandardMaterial color="red" />
              </mesh>
              <Ballrod size={0.2} length={0.5} />
            </group>
            <PerspectiveCamera
              rotation={[0, Math.PI, 0]}
              near={0.01}
              makeDefault={planetCamera}
              ref={planetCamRef}
              rotation-order={"YXZ"}
            ></PerspectiveCamera>
          </group>
        </group>
      </group>
    </>
  );
}
