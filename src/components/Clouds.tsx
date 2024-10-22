import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useStore } from "../store";

export function Clouds({ size }) {
  const cloudsRef: any = useRef();
  const posRef: any = useStore((state) => state.posRef);

  const [cloudsMap] = useTexture(["/textures/2k_earth_clouds.jpg"]);

  useFrame(() => {
    cloudsRef.current.rotation.y -= 0.0001;
  });
  return (
    <>
      <mesh ref={cloudsRef} scale={1}>
        <sphereGeometry args={[size + 0.03, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          opacity={0.2}
          depthWrite={true}
          transparent={true}
        />
      </mesh>
    </>
  );
}
