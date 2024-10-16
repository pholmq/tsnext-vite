import { PerspectiveCamera, CameraControls } from "@react-three/drei";
import { useRef, useLayoutEffect, useEffect } from "react";
import { useStore } from "../store";
import { Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useLevaControls } from "./useLevaControls";

export default function SystemCamera() {
  const cameraRef = useRef(null);
  const resetClicked = useStore((s) => s.resetClicked);
  const cameraTarget = useStore((s) => s.cameraTarget);
  const cameraFollow = useStore((s) => s.cameraFollow);
  const planetCamera = useStore((s) => s.planetCamera);
  const target = new Vector3();
  const { scene, camera } = useThree();
  const cameraControlsRef = useRef<CameraControls>(null);
  const targetObjRef = useRef(null);
  const { updateControls } = useLevaControls();

  useEffect(() => {
    //Wait for camera to load
    setTimeout(() => {
      cameraControlsRef.current.smoothTime = 2;
      cameraControlsRef.current.rotatePolarTo(Math.PI / 3, true);
    }, 1);
  }, []);
  useEffect(() => {
    //Reset camera when the Reset button is clicked
    cameraControlsRef.current.setPosition(-3000, 0, 0, false);
    updateControls({ Target: "Earth" });

    cameraControlsRef.current.smoothTime = 0;
    cameraControlsRef.current.rotatePolarTo(Math.PI / 3, true);
  }, [resetClicked]);

  useLayoutEffect(() => {
    targetObjRef.current = scene.getObjectByName(cameraTarget);
    targetObjRef.current.getWorldPosition(target);
    cameraControlsRef.current.setTarget(target.x, target.y, target.z, false);
  }, [cameraTarget, camera]);

  useFrame(() => {
    if (cameraFollow) {
      targetObjRef.current.getWorldPosition(target);
      cameraControlsRef.current.setTarget(target.x, target.y, target.z, false);
    }
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault={!planetCamera}
        name="SystemCamera"
        ref={cameraRef}
        position={[-3000, 0, 0]}
        fov={15}
        near={0.1}
        far={10000000}
      />
      <CameraControls ref={cameraControlsRef} camera={cameraRef.current} />
    </>
  );
}