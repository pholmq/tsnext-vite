import { useRef, useEffect, useState } from "react";
import { CameraHelper, Vector3, Quaternion, Euler, Object3D } from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  useTexture,
  PerspectiveCamera,
  useHelper,
  CameraControls,
} from "@react-three/drei";
import useKeyPress from "../utils/useKeyPress";
import useMouseButton from "../utils/useMouseButton";
import useMousePosition from "../utils//useMousePosition";

export default function PlanetCamera() {
  const earthRadius = 4;
  const longitude = 0;
  const latitude = 0;
  const planetCam: any = useRef();
  const longRef = useRef(null);
  const latRef = useRef(null);
  useHelper(planetCam, CameraHelper);
  const keyPressed = useKeyPress();
  const mouse = useMousePosition();
  const pressedButton = useMouseButton();

  // console.log(keyPressed);
  // if (pressedButton !== null) {
  //   console.log(pressedButton);
  // }

  let startX = null;
  let startY = 0;
  let rotationY = 0;
  let rotationX = 0;
  useFrame(() => {
    // if (!planetCam.current) {
    //   return
    // }
    if (pressedButton === 0) {
      if (startX === null) {
        startX = mouse.current.x;
        rotationY = planetCam.current.rotation.y;
        startY = mouse.current.y;
        rotationX = planetCam.current.rotation.x;
      }

      planetCam.current.rotation.y = rotationY + (mouse.current.x - startX) * 2;
      if (
        rotationX - (mouse.current.y - startY) * 2 < Math.PI / 2 &&
        rotationX - (mouse.current.y - startY) * 2 > -Math.PI / 2
      ) {
        planetCam.current.rotation.x =
          rotationX - (mouse.current.y - startY) * 2;
      }
      // console.log(planetCam.current.rotation.x);
    } else {
      startX === null;
    }

    if (keyPressed) {
      if (keyPressed === "d") {
        longRef.current.rotation.y -= 0.005;
      }
      if (keyPressed === "a") {
        longRef.current.rotation.y += 0.005;
      }
      if (keyPressed === "w") {
        latRef.current.rotation.x += 0.005;
      }
      if (keyPressed === "s") {
        latRef.current.rotation.x -= 0.005;
      }

      if (longRef.current.rotation.y > Math.PI * 2) {
        longRef.current.rotation.y = 0;
      }
      if (longRef.current.rotation.y < 0) {
        longRef.current.rotation.y = 2 * Math.PI;
      }

      if (keyPressed === "ArrowUp") {
        planetCam.current.rotation.x += 0.01;
      }
      if (keyPressed === "ArrowDown") {
        planetCam.current.rotation.x -= 0.01;
      }
      if (keyPressed === "ArrowLeft") {
        planetCam.current.rotation.y += 0.01;
      }
      if (keyPressed === "ArrowRight") {
        planetCam.current.rotation.y -= 0.01;
      }
      if (keyPressed === "PageUp") {
        planetCam.current.fov += 1;
      }
    }
  });

  return (
    <group ref={longRef} rotation={[0, longitude, 0]}>
      <group ref={latRef} rotation={[latitude, 0, 0]}>
        <group position={[0, earthRadius, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshStandardMaterial color="red" />
          </mesh>
          <PerspectiveCamera
            near={0.00001}
            makeDefault={true}
            ref={planetCam}
            rotation-order={"YXZ"}
            // rotation={[camPos.Up, camPos.Direction, 0]}
          ></PerspectiveCamera>
        </group>
      </group>
    </group>
  );
}
