import { useEffect, useLayoutEffect, useRef } from "react";
import { CameraHelper, Vector3 } from "three";

import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, useHelper, Html } from "@react-three/drei";

import { useGesture } from "@use-gesture/react";

import useKeyPress from "../utils/useKeyPress";
import { useStore } from "../store";

export default function PlanetCamera({ planetRadius }) {
  let cameraHeight = planetRadius + 0.1;
  const longitude = 0;
  const latitude = 0;
  const planetCamRef: any = useRef();
  const longAxisRef = useRef(null);
  const latAxisRef = useRef(null);
  const camMountRef = useRef(null);
  const keyPressed = useKeyPress();

  const { camera, gl } = useThree();
  const planetCamera = useStore((s) => s.planetCamera);
  const planetCameraHelper = useStore((s) => s.planetCameraHelper);
  const cameraTarget = useStore((s) => s.cameraTarget);

  // useEffect(() => {
  //   if (useStore.getState().planetCameraDirection) {
  //     loadCameraPosition();
  //   }
  // }, [cameraTarget, planetCamera]);

  useHelper(
    //Only show helper if planetCamera is not active
    planetCameraHelper && !planetCamera ? planetCamRef : false,
    CameraHelper
  );

  function loadCameraPosition() {}

  function saveCameraPosition() {
    useStore.setState((s) => ({
      planetCameraDirection: {
        camRotationy: planetCamRef.current.rotation.y,
        camRotationx: planetCamRef.current.rotation.x,
        camFov: planetCamRef.current.fov,
        latRotationx: latAxisRef.current.rotation.x + Math.PI / 2,
        longRotationy: longAxisRef.current.rotation.y + Math.PI / 2,
        // camMountPosy: camMountRef.current.position.y,
      },
    }));
  }

  //Set touch action to none so useGesture doesn't complain
  gl.domElement.style.touchAction = "none";
  useGesture(
    {
      onDrag: planetCamera //If planetCamera is true, then we hand it a function
        ? ({ delta: [dx, dy] }) => {
            const sensitivity = 0.01;
            planetCamRef.current.rotation.y += dx * sensitivity;
            const camRotationX =
              planetCamRef.current.rotation.x + dy * sensitivity;
            if (camRotationX < Math.PI / 2 && camRotationX > -Math.PI / 2) {
              planetCamRef.current.rotation.x = camRotationX;
            }
            saveCameraPosition();
          }
        : () => {}, // and if not, it gets and empty function

      onWheel: planetCamera
        ? ({ delta: [, dy] }) => {
            //
            const sensitivity = 0.1;
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
        latRotationX += 0.005;
        break;
      case "s":
        latRotationX -= 0.005;
        break;
      case "a":
        longAxisRef.current.rotation.y -= 0.005;
        break;
      case "d":
        longAxisRef.current.rotation.y += 0.005;
        break;
      case "q":
        camMountRef.current.position.y += 0.005;
        break;
      case "e":
        if (camMountRef.current.position.y > planetRadius + 0.007) {
          camMountRef.current.position.y -= 0.005;
        }
        break;
    }
    if (keyPressed === "PageUp") {
      if (planetCamRef.current.fov > 0) {
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

    camRotationX = planetCamRef.current.rotation.x;
    switch (keyPressed) {
      case "ArrowUp":
        camRotationX += 0.01;
        break;
      case "ArrowDown":
        camRotationX -= 0.01;
        break;
      case "ArrowLeft":
        planetCamRef.current.rotation.y += 0.01;
        break;
      case "ArrowRight":
        planetCamRef.current.rotation.y -= 0.01;
        break;
    }

    if (keyPressed) {
      if (latRotationX > 0) latRotationX = 0;
      if (latRotationX < -Math.PI) latRotationX = -Math.PI;
      latAxisRef.current.rotation.x = latRotationX;
      if (camRotationX < Math.PI / 2 && camRotationX > -Math.PI / 2) {
        planetCamRef.current.rotation.x = camRotationX;
      }
      saveCameraPosition();
    }
  });

  return (
    <>
      {/* We put the camera system in two groups and rotate it so that lat and long are at 0 */}
      <group ref={longAxisRef} rotation={[0, -Math.PI / 2, 0]}>
        <group ref={latAxisRef} rotation={[-Math.PI / 2, 0, 0]}>
          <group ref={camMountRef} position={[0, cameraHeight, 0]}>
            {/* hide the box if planetcamera is active or if show camera pos is off  */}
            {planetCamera || !planetCameraHelper ? null : (
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="red" />
              </mesh>
            )}
            <PerspectiveCamera
              rotation={[0, Math.PI, 0]}
              near={0.00001}
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
