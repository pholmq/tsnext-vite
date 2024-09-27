import { Canvas } from "@react-three/fiber";
import { Sphere, Stars } from "@react-three/drei";
import CustomCameraControls from "./components/CustomCameraControls";
import AnimationController from "./components/AnimationController";
import SolarSystem from "./components/SolarSystem";
import PlotSolarSystem from "./components/PlotSolarSystem";
import TraceController from "./components/TraceController";
import { Vector3 } from "three";
import { Controls } from "./components/Controls";
import { CopyPosToClipb } from "./components/CopyPosToClipb";
import Sidebar from "./components/Sidebar";
import PlanetCameraInfo from "./components/PlanetCameraInfo";
import ExoplanetStars from "./components/ExoplanetStars";

function TSNext() {
  return (
    <>
      <Canvas
        camera={{
          name: "Camera",
          fov: 15,
          position: new Vector3(0, 3000, 0),
          near: 0.1,
          far: 10000000,
        }}
      >
        <CustomCameraControls />
        <ambientLight intensity={0.5} />
        {/* <Stars count={800} radius={100000} /> */}
        <AnimationController />
        <SolarSystem />
        <PlotSolarSystem />
        <TraceController />
        <CopyPosToClipb />
        <axesHelper args={[5]} position={[0, 0, 0]} />
        {/* <mesh rotation={[-Math.PI / 5, 0, Math.PI / 4]}>
          <tetrahedronGeometry />
          <meshPhongMaterial color="gold" />
          <Sphere args={[0.35, 64, 32]} position={[0.03, 0.03, 0.03]}>
            <meshPhongMaterial color="black" />
          </Sphere>
        </mesh> */}
        <ExoplanetStars />
      </Canvas>
      <Controls />
      {/* <Sidebar /> */}
      <PlanetCameraInfo />
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
