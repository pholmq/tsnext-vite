import { Canvas } from "@react-three/fiber";
import { Loader, Preload, Sphere, Stars } from "@react-three/drei";
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
import { useState, Suspense } from "react";
import LoadingBar from "./components/LoadingBar"; // Import the loading bar
import { useProgress } from "@react-three/drei"; // Import useProgress to detect when loading is complete

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
        <Suspense fallback={null}>
          <CustomCameraControls />
          <ambientLight intensity={0.5} />
          {/* <Stars count={800} radius={100000} /> */}
          <AnimationController />
          <SolarSystem />
          <PlotSolarSystem />
          <TraceController />
          <CopyPosToClipb />
          <axesHelper args={[5]} position={[0, 0, 0]} />
          <ExoplanetStars />
        </Suspense>
      </Canvas>
      <Controls />
      {/* <Sidebar /> */}
      <PlanetCameraInfo />
      <Sidebar />
    </>
  );
}

export default function App() {
  const { active } = useProgress(); // Check if loading is still active
  const [isLoaded, setIsLoaded] = useState(false);

  // Once assets finish loading, update the state
  // useState(() => {
  //   if (!active) {
  //     setIsLoaded(true);
  //   }
  // }, [active]);

  return (
    <div className="App h-screen bg-black">
      {/* {!isLoaded && <LoadingBar />}{" "}
      {/* Show loading bar until loading is complete */}
      {/* {isLoaded && <TSNext />} Render the scene once loading is complete */}{" "}
      */
      <TSNext />
    </div>
  );
}
