import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function PlanetRings({ innerRadius, outerRadius, planetSize, texture }) {
  const ringRef = useRef();
  const [ringTexture] = useTexture([texture]); // Ensure textures are loaded for rings

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius + 10, 64]} />
      <meshBasicMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
}
