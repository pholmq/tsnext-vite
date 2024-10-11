import { useRef } from "react";
import { CameraHelper } from "three";

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
  const longRef = useRef(null);
  const latRef = useRef(null);
  const camMountRef = useRef(null);
  const keyPressed = useKeyPress();

  const { gl } = useThree();
  //Set touch action to none so useGesture doesn't complain
  gl.domElement.style.touchAction = "none";

  let rotateX = 0;

  const planetCamera = useStore((s) => s.planetCamera);

  const planetCameraHelper = useStore((s) => s.planetCameraHelper);

  useHelper(planetCameraHelper ? planetCamRef : false, CameraHelper);

  useGesture(
    {
      onDrag: planetCamera //If planetCamera is true, then we hand it a function
        ? ({ delta: [dx, dy] }) => {
            const sensitivity = 0.01;
            planetCamRef.current.rotation.y += dx * sensitivity;
            const rotationX =
              planetCamRef.current.rotation.x + dy * sensitivity;
            if (rotationX < Math.PI / 2 && rotationX > -Math.PI / 2) {
              planetCamRef.current.rotation.x = rotationX;
            }
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
          }
        : () => {},
    },
    {
      target: gl.domElement,
      eventOptions: { passive: false },
    }
  );

  let startX = null;
  let startY = 0;
  let rotationY = 0;
  let rotationX = 0;
  useFrame(() => {
    switch (keyPressed) {
      case "w":
        latRef.current.rotation.x += 0.005;
        break;
      case "s":
        latRef.current.rotation.x -= 0.005;
        break;
      case "a":
        longRef.current.rotation.y += 0.005;
        break;
      case "d":
        longRef.current.rotation.y -= 0.005;
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
    if (longRef.current.rotation.y > Math.PI * 2) {
      longRef.current.rotation.y = 0;
    }
    if (longRef.current.rotation.y < 0) {
      longRef.current.rotation.y = 2 * Math.PI;
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

    switch (keyPressed) {
      case "ArrowUp":
        planetCamRef.current.rotation.x += 0.01;
        break;
      case "ArrowDown":
        planetCamRef.current.rotation.x -= 0.01;
        break;
      case "ArrowLeft":
        planetCamRef.current.rotation.y += 0.01;
        break;
      case "ArrowRight":
        planetCamRef.current.rotation.y -= 0.01;
        break;
    }
  });

  return (
    <>
      <group ref={longRef} rotation={[0, longitude, 0]}>
        <group ref={latRef} rotation={[latitude, 0, 0]}>
          <group ref={camMountRef} position={[0, cameraHeight, 0]}>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.05, 0.05, 0.05]} />
              <meshStandardMaterial color="red" />
            </mesh>
            <PerspectiveCamera
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
