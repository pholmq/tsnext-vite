import { useFrame } from "@react-three/fiber";
import { useStore } from "../store";
import { useEffect, useRef, useState } from "react";

export default function SquashableSphere() {
  const meshRef = useRef(null);
  const squashFactor = useStore((state) => state.squashFactor);

  useEffect(() => {
    // Apply the squash to the sphere's scale
    meshRef.current.scale.set(1, 1 / squashFactor, 1);
  }, [squashFactor]);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
