import { useEffect, useLayoutEffect, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import { useStore } from "../store";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const OrbitCamera = () => {
  const cameraTarget = useStore((s) => s.cameraTarget);
  const cameraFollow = useStore((s) => s.cameraFollow);
  const planetCamera = useStore((s) => s.planetCamera);
  const target = new Vector3();
  const { scene, camera } = useThree();
  const cameraControlsRef = useRef<CameraControls>(null);
  const targetObjRef = useRef(null);

  useLayoutEffect(() => {
    targetObjRef.current = scene.getObjectByName(cameraTarget);
    targetObjRef.current.getWorldPosition(target);
    cameraControlsRef.current.setTarget(target.x, target.y, target.z, false);
  }, [cameraTarget, camera]);

  useLayoutEffect(() => {
    cameraControlsRef.current.smoothTime = 2;
    cameraControlsRef.current.rotatePolarTo(Math.PI / 3, true);
  }, []);

  useFrame(() => {
    if (cameraFollow) {
      targetObjRef.current.getWorldPosition(target);
      cameraControlsRef.current.setTarget(target.x, target.y, target.z, false);
    }
  });

  return (
    <CameraControls
      ref={cameraControlsRef}
      maxDistance={80000}
      // if planetCamera is active we camera controls should be diabled
      enabled={!planetCamera}
    />
  );
};

export default function CustomCameraControls() {
  return (
    <>
      <OrbitCamera />
    </>
  );
}
