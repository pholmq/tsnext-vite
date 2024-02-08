import { Canvas } from "@react-three/fiber";
import { CameraControls, Sphere, Stars } from "@react-three/drei";
import AnimationController from "./components/AnimationController";
import SolarSystem from "./components/SolarSystem";
import ControlPanel from "./components/ControlPanel";
import PlotSolarSystem from "./components/PlotSolarSystem";
import TraceController from "./components/TraceController";
import PositionsWriter from "./components/PositionsWriter";
import { Vector3 } from "three";
import { useLayoutEffect, useRef } from "react";
import Draggable from "react-draggable";

function CustomCameraControls() {
  const cameraControlsRef = useRef<CameraControls>(null);

  useLayoutEffect(() => {
    cameraControlsRef.current.smoothTime = 2;
    cameraControlsRef.current.rotatePolarTo(Math.PI / 3, true);
  }, []);
  return (
    <CameraControls
      // enabled={true}
      ref={cameraControlsRef}
      maxDistance={500000}
    />
  );
}

function TSNext() {
  return (
    <>
      <Canvas
        camera={{
          fov: 15,
          position: new Vector3(0, 3000, 0),
          near: 0.1,
          far: 10000000,
        }}
      >
        <CustomCameraControls />
        <ambientLight intensity={0.5} />
        <Stars radius={100000} />
        <AnimationController />
        <SolarSystem />
        <PlotSolarSystem />
        <TraceController />
        <PositionsWriter />
        <axesHelper args={[5]} position={[0, 0, 0]} />
        <mesh rotation={[-Math.PI / 5, 0, Math.PI / 4]}>
          <tetrahedronGeometry />
          {/* <boxGeometry args={[1, 1, 1]} /> */}
          <meshPhongMaterial color="gold" />
          <Sphere args={[0.35, 64, 32]} position={[0.03, 0.03, 0.03]}>
            <meshPhongMaterial color="black" />
          </Sphere>
        </mesh>
      </Canvas>
      {/* <Draggable> Draggable not working. Time to rewrite the controlpanel.. */}
      <ControlPanel />
      {/* </Draggable> */}
    </>
  );
}

export default function App() {
  return (
    <div className="App h-screen bg-black">
      <TSNext />
    </div>
  );
}
