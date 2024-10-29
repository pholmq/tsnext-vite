import { Canvas } from "@react-three/fiber";
import { Loader, Preload, Sphere, Stars, useProgress } from "@react-three/drei";
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
import { useState, Suspense } from "react";
import LoadingBar from "./components/LoadingBar"; // Import the loading bar
import { Leva } from "leva";
import { AsteroidBelt } from "./components/AstroidBelt";
import SystemCamera from "./components/SystemCamera";
import InfoPanel from "./components/InfoPanel";
import PosWriter from "./components/PosWriter";
import Ra0Dec0 from "./components/Ra0Dec0";
import Ra0Dec02 from "./components/Ra0Dec02";

function TSNext() {
  return (
    <>
      <Loader />
      <Canvas
        camera={{
          name: "Camera",
          fov: 15,
          position: new Vector3(0, 3000, 0),
          near: 0.1,
          far: 10000000,
        }}
      >
        <Suspense>
          <SystemCamera />
          <ambientLight intensity={0.5} />
          {/* Remove this comment below? */}
          <Stars count={800} radius={5000} />
          <AnimationController />
          <SolarSystem />
          <PlotSolarSystem />
          <TraceController />
          <PosWriter />
          {/* <CopyPosToClipb /> */}
          <axesHelper args={[5]} position={[0, 0, 0]} />
          {/* <ExoplanetStars /> */}
          {/* <AsteroidBelt /> */}
        </Suspense>
      </Canvas>
      <Controls />
      <InfoPanel />
      {/* <Sidebar /> */}
    </>
  );
}

export default function App() {
  const { active } = useProgress(); // Check if loading is still active
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="App h-screen bg-black">
      <TSNext />
    </div>
  );
}
