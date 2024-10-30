import React from "react";
import { useTexture } from "@react-three/drei";
import { Vector3 } from "three";

export default function Ground({ size = 10, position = [0, 0, 0] }) {
  // Load the texture
  const [texture] = useTexture(["/textures/grass.png"]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position as any}>
      <circleGeometry args={[size, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
