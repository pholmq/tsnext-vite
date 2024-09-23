import { useEffect, useLayoutEffect, useRef } from "react";
import { CameraControls, FlyControls } from "@react-three/drei";
import { useStore } from "../store";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useFrameInterval } from "../utils/useFrameInterval";
import { folder, useControls } from "leva";

const OrbitCamera = () => {
  const cameraTarget = useStore((s) => s.cameraTarget);
  const cameraFollow = useStore((s) => s.cameraFollow);
  // const cameraFollow = true;
  const target = new Vector3();
  const { scene } = useThree();
  const cameraControlsRef = useRef<CameraControls>(null);
  const targetObjRef = useRef(null);
  useLayoutEffect(() => {
    // cameraControlsRef.current.smoothTime = 0.01;
    if (cameraTarget === "SystemCenter") {
      cameraControlsRef.current.setTarget(0, 0, 0);
    } else {
      targetObjRef.current = scene.getObjectByName(cameraTarget);
      targetObjRef.current.getWorldPosition(target);
      cameraControlsRef.current.setTarget(target.x, target.y, target.z, false);
    }
  }, [cameraTarget]);

  useLayoutEffect(() => {
    cameraControlsRef.current.smoothTime = 2;
    cameraControlsRef.current.rotatePolarTo(Math.PI / 3, true);
  }, []);

  // useFrameInterval(() => {
  //   if (cameraFollow) {
  //     scene.getObjectByName(cameraTarget).getWorldPosition(target);
  //     cameraControlsRef.current.setTarget(target.x, target.y, target.z, false);
  //   }
  // }, 0.1);
  useFrame(() => {
    if (cameraFollow) {
      targetObjRef.current.getWorldPosition(target);
      cameraControlsRef.current.setTarget(target.x, target.y, target.z, false);
    }
  });

  return <CameraControls ref={cameraControlsRef} maxDistance={500000} />;
};

const FlyCamera = () => {
  return <FlyControls dragToLook={true} movementSpeed={50} rollSpeed={0.1} />;
};

export default function CustomCameraControls() {
  const planetCamera = useStore((s) => s.planetCamera);

  return (
    <>
      {planetCamera ? null : <OrbitCamera />}
      {/* {camera === "orbit" ? <OrbitCamera /> : null} */}
      {/* {camera === "fly" ? <FlyCamera /> : null} */}
    </>
  );
}
