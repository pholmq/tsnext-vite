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
import Sidebar from "./components/SideBar";

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
        <Stars radius={100000} />
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
      </Canvas>
      <Controls />
      <Sidebar>
        <iframe
          src="https://example.com"
          title="External content"
          style={{ width: "100%", height: "300px", border: "none" }}
        />
        <img
          src="https://google.com"
          alt="Example"
          style={{ width: "100%", marginTop: "20px" }}
        />
        <p style={{ marginTop: "20px" }}>
          This is a sidebar with dynamic HTML content. You can put anything here.
        </p>
      </Sidebar>
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
