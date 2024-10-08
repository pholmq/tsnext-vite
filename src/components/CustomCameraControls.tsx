import { useEffect, useLayoutEffect, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import { useStore } from "../store";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const OrbitCamera = () => {
  const cameraTarget = useStore((s) => s.cameraTarget);
  const cameraFollow = useStore((s) => s.cameraFollow);
  // const cameraFollow = true;
  const target = new Vector3();
  const { scene } = useThree();
  const cameraControlsRef = useRef<CameraControls>(null);
  const targetObjRef = useRef(null);

  useLayoutEffect(() => {
    targetObjRef.current = scene.getObjectByName(cameraTarget);
    targetObjRef.current.getWorldPosition(target);
    cameraControlsRef.current.setTarget(target.x, target.y, target.z, false);
  }, [cameraTarget]);

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

  return <CameraControls ref={cameraControlsRef} maxDistance={80000} />;
};

export default function CustomCameraControls() {
  const planetCamera = useStore((s) => s.planetCamera);

  return <>{planetCamera ? null : <OrbitCamera />}</>;
}
