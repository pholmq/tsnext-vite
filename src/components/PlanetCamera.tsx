import { useRef } from "react";
import { CameraHelper } from "three";

import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, useHelper } from "@react-three/drei";

import { useGesture } from "@use-gesture/react";

import useKeyPress from "../utils/useKeyPress";
// import usePressedKey from "../utils/usePressedKey";
import useMouseButton from "../utils/useMouseButton";
import useMousePosition from "../utils//useMousePosition";
import useScrollWheel from "../utils/useScrollWheel";

export default function PlanetCamera() {
  const earthRadius = 4;
  const longitude = 0;
  const latitude = 0;
  const planetCam: any = useRef();
  const longRef = useRef(null);
  const latRef = useRef(null);
  useHelper(planetCam, CameraHelper);
  // const keyPressed = useKeyPress();
  const keyPressed = useKeyPress();
  const mouse = useMousePosition();
  const pressedButton = useMouseButton();
  const scrollState = useScrollWheel();

  const { gl } = useThree();

  let rotateX = 0;

  useGesture(
    {
      onDrag: ({ delta: [dx, dy] }) => {
        const sensitivity = 0.01;
        planetCam.current.rotation.y += dx * sensitivity;
        const rotationX = planetCam.current.rotation.x + dy * sensitivity;
        if (rotationX < Math.PI / 2 && rotationX > -Math.PI / 2) {
          planetCam.current.rotation.x = rotationX;
        }
      },
      onWheel: ({ delta: [, dy] }) => {
        //
        const sensitivity = 0.1;
        const fov = planetCam.current.fov + dy * sensitivity;

        if (fov > 0 && fov < 120) {
          planetCam.current.fov = fov;
        }
      },
    },
    {
      target: gl.domElement,
      eventOptions: { passive: false },
    }
  );

  // console.log(keyPressed);
  // if (pressedButton !== null) {
  //   console.log(pressedButton);
  // }

  let startX = null;
  let startY = 0;
  let rotationY = 0;
  let rotationX = 0;
  useFrame(() => {
    if (keyPressed) {
      console.log(keyPressed);
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
        if (planetCam.current.fov > 0) {
          planetCam.current.fov -= 0.5;
          planetCam.current.updateProjectionMatrix();
        }
      }
      if (keyPressed === "PageDown") {
        if (planetCam.current.fov < 120) {
          planetCam.current.fov += 0.5;
          planetCam.current.updateProjectionMatrix();
        }
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
          ></PerspectiveCamera>
        </group>
      </group>
    </group>
  );
}
