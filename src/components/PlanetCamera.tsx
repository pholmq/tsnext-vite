import { useControls } from "leva";
import { useRef, useEffect } from "react";
import { CameraHelper, Vector3, Quaternion, Euler } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrthographicCamera,
  Box,
  useHelper
} from "@react-three/drei";
export default function PlanetCamera(props: any) {
  const { camera, scene }: any = useThree();
  const camControls: any = useThree((state) => state.controls);

  const toggleCam = useControls("Planet Camera", {
    on: false
  },  { collapsed: true });

  const [showH, setHelper] = useControls("Planet Camera", () => ({
    showHelper: false
  }));

  const camProps = useControls("Planet Camera", {
    fov: { value: 25, max: 100, min: 10 },
    far: { value: 500, max: 1000, min: 1 },
    near: { value: 0, max: 0.5, min: 0.000000001, step: 0.0001 }
  });

  const camPos = useControls("Planet Camera", {
    Direction: { value: 0, max: Math.PI * 2, min: 0 },
    Up: { value: 0, max: Math.PI / 2, min: -Math.PI / 2 },
    Height: { value: 3.51, max: 10, min: 3, step: 0.0001 },
    Latitude: { value: 0, max: Math.PI, min: -Math.PI, step: 0.001 },
    Longitude: { value: 0, max: Math.PI * 2, min: 0, step: 0.001 }
  });

  // console.log("toggleCam.on: " + toggleCam.on);
  // console.log("camera: " + camera);
  // console.log("camControls.enabled: " + camControls.enabled);
  const planetCam: any = useRef();
  useHelper(showH.showHelper && planetCam, CameraHelper);

  const vector = new Vector3();
  const quaternion = new Quaternion();
  const slerpQuaternion = new Quaternion();
  useFrame(() => {
    if (!toggleCam.on || camControls === null) return;

    planetCam.current.getWorldPosition(vector);
    planetCam.current.getWorldQuaternion(quaternion);

    camera.getWorldQuaternion(slerpQuaternion);
    if (camera.position.distanceTo(vector) > 0.6) {
      //lerp & slerp cam towards planet
      camera.position.lerp(vector, 0.03);
      slerpQuaternion.slerp(quaternion, 0.0003);
      camera.rotation.setFromQuaternion(slerpQuaternion);
      return;
    }

    camera.position.copy(vector);
    camera.rotation.setFromQuaternion(quaternion);
    camera.fov = planetCam.current.fov;
    camera.far = planetCam.current.far;
    camera.near = planetCam.current.near;
    camera.updateProjectionMatrix();
  });

  useEffect(() => {
    // console.log("toggleCam.on: " + toggleCam.on);
    // console.log("camera: " + camera);
    // console.log("controls: " + controls);
    const orgCamPos = new Vector3();
    const orgRotation = new Quaternion();
    let orgFov, orgFar, orgNear;
    if (camControls !== null && camera !== null) {
      // console.log("camera: " + camera.position.x);
      if (toggleCam.on) {
        camera.getWorldPosition(orgCamPos);
        // camera.getWorldQuaternion(orgRotation);
        // orgFov = camera.fov;
        // orgFar = camera.far;
        // orgNear = camera.near;
        camControls.enabled = false;

        const earthObj = scene.getObjectByName("Earth");
        var vec = new Vector3();
        earthObj.getWorldPosition(vec);

        console.log(
          "Rotation: " + [...earthObj.rotation] + " Worldpos: " + {...vec}
        );
      } else {
        // camera.position.copy(orgCamPos);
        // camera.rotation.setFromQuaternion(orgRotation);
        // camera.fov = orgFov;
        // camera.far = orgFar;
        // camera.near = orgNear;
        camControls.enabled = true;
      }
    }
  });
  return (
    <group rotation={[0, camPos.Longitude, 0]}>
      {/* <Sphere args={[0.1, 8, 8]}/> */}
      <group rotation={[camPos.Latitude, 0, 0]}>
        {/* <Cylinder position={[0, 0.5, 0]} args={[0.01, 0.01, 1]} /> */}
        <group position={[0, 0.5, 0]}>
          {/* <CompassText /> */}

          {/* Note: It's crucial to set rotation-order = {"YXZ"} otherwise the camera will look up/down incorrectly */}
          <group position={[0, camPos.Height, 0]}>
            {/* <Box args={[0.02, 0.01, 0.02]} position={[0, 0, 0]}> */}
            <Box args={[0.02, 0.02, 0.02]} position={[0, 0, 0]}>
              <meshBasicMaterial color="#ff0000" />
            </Box>
            <PerspectiveCamera
              ref={planetCam}
              {...camProps}
              position={[0, 0, 0]}
              rotation-order={"YXZ"}
              rotation={[camPos.Up, camPos.Direction, 0]}
            ></PerspectiveCamera>
            {/* <OrthographicCamera
              ref={planetCam}
              // {...camProps}
              position={[0, 0, 0]}
              rotation-order={"YXZ"}
              rotation={[camPos.Up, camPos.Direction, 0]}
            ></OrthographicCamera> */}
          </group>
        </group>
      </group>
    </group>
  );
}
