import { useEffect, useLayoutEffect, useRef } from "react";
import { CameraControls, FlyControls } from "@react-three/drei";
import { useStore } from "../store";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useFrameInterval } from "../utils/useFrameInterval";
import { folder, useControls } from "leva";

const OrbitCamera = () => {
  const cameraTarget = useStore((s) => s.cameraTarget);
  //   const cameraFollow = useStore((s) => s.cameraFollow);
  const target = new Vector3();
  const { scene } = useThree();
  const cameraControlsRef = useRef<CameraControls>(null);

  useLayoutEffect(() => {
    if (cameraTarget === "SystemCenter") {
      cameraControlsRef.current.setTarget(0, 0, 0);
    } else {
      scene.getObjectByName(cameraTarget).getWorldPosition(target);
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
  // }, 1);

  return <CameraControls ref={cameraControlsRef} maxDistance={500000} />;
};

const FlyCamera = () => {
  return <FlyControls dragToLook={true} movementSpeed={50} rollSpeed={0.1} />;
};

export default function CustomCameraControls() {
  return (
    <>
      <OrbitCamera />
      {/* {camera === "orbit" ? <OrbitCamera /> : null} */}
      {/* {camera === "fly" ? <FlyCamera /> : null} */}
    </>
  );
}
