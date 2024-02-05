import { Canvas } from "@react-three/fiber";
import { Circle, OrbitControls, Sphere, Stars } from "@react-three/drei";
import AnimationController from "./components/AnimationController";
import SolarSystem from "./components/SolarSystem";
import ControlPanel from "./components/ControlPanel";
import PlotSolarSystem from "./components/PlotSolarSystem";
import TraceController from "./components/TraceController";
import { Vector3 } from "three";
import { useStore } from "./store";

// import Line from "./components/Line";
//tstxxx
function TSNext() {
  const trace = useStore.getState().trace;

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
        <OrbitControls makeDefault enableDamping={false} maxDistance={500000} />
        <ambientLight intensity={0.5} />
        <Stars radius={100000} />
        <AnimationController />
        <SolarSystem />
        <PlotSolarSystem />
        <TraceController />
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
