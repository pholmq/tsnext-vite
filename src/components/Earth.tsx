import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useStore } from "../store";
import { Html } from "@react-three/drei";

import { CelestialSphere } from "./CelestialSphere";

export function Earth(props: any) {
  const earthRef: any = useRef();
  const cloudsRef: any = useRef();
  const posRef: any = useStore((state) => state.posRef);
  const [hovered, setHover] = useState(false);
  const [doubleClick, setDoubleClick] = useState(false);

  const [cloudsMap, colorMap, bumpMap] = useTexture([
    "/textures/2k_earth_clouds.jpg",
    "/textures/8k_earth_daymap.jpg",
    "/textures/EarthBumpmap1024x512.png",
  ]);

  useEffect(() => {
    if (doubleClick) {
      useStore.setState({ cameraTarget: props.name });
      // console.log("doubleClick");
      setDoubleClick(false);
    }
  }, [doubleClick]);

  useFrame(() => {
    earthRef.current.rotation.y = props.rotationSpeed * posRef.current;
    cloudsRef.current.rotation.y -= 0.0001;
  });
  return (
    <>
      <group
        rotation={[
          props.tiltb * (Math.PI / 180),
          0,
          props.tilt * (Math.PI / 180),
        ]}
      >
        {/* "Move the berycenter and make that the center for all the stars"  */}
        <CelestialSphere visible={false} />
        <mesh
          name="Earth"
          ref={earthRef}
          scale={1}
          onPointerOver={(e) => setHover(true)}
          onPointerOut={(e) => setHover(false)}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setDoubleClick(true);
          }}
        >
          <sphereGeometry args={[props.size, 128, 128]} />
          <meshPhongMaterial map={colorMap} specular={0x404040} />

          <mesh ref={cloudsRef} scale={1}>
            <sphereGeometry args={[props.size + 0.03, 64, 64]} />
            <meshPhongMaterial
              map={cloudsMap}
              opacity={0.2}
              depthWrite={true}
              transparent={true}
            />
          </mesh>
          {hovered && (
            <Html position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
              <div className="text-white text-center select-none">Earth</div>
            </Html>
          )}
        </mesh>
      </group>
    </>
  );
}
