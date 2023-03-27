import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, OrbitControls, Stars } from "@react-three/drei";
import AnimationController from "./components/AnimationController";
import SolarSystem from "./components/SolarSystem";
import ControlPanel from "./components/ControlPanel";
function TSNext() {
  return (
    <>
      <Canvas
        camera={{
          fov: 15,
          position: [0, 3000, 0],
          near: 0.1,
          far: 10000000,
        }}
      >
        <OrbitControls makeDefault enableDamping={false} maxDistance={500000} />
        <axesHelper args={[10]} position={[0, 0, 0]} />
        <ambientLight intensity={0.5} />
        <Stars radius={100000} />
        <AnimationController />
        <SolarSystem />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Canvas>
      <ControlPanel />
    </>
  );
}

function App() {
  return (
    <div className="App h-screen bg-black">
      <TSNext />
    </div>
  );
}

export default App;
