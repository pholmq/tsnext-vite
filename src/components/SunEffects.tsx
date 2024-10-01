// src/components/SunEffects.tsx
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Hook to define the Sun's materials (glow and surface)
export function useSunMaterials() {
  const sunGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.5,
        side: THREE.BackSide, // BackSide to make it glow from inside out
      }),
    []
  );

  const sunSurfaceMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        emissive: 0xffaa00,
        emissiveIntensity: 1,
        shininess: 50,
      }),
    []
  );

  return { sunGlowMaterial, sunSurfaceMaterial };
}

// Component to create the Sun's glow effect
export function SunGlow({ size }: { size: number }) {
  const { sunGlowMaterial } = useSunMaterials();

  return (
    <mesh scale={1.2}>
      <sphereGeometry args={[size + 0.1, 64, 64]} />
      <primitive attach="material" object={sunGlowMaterial} />
    </mesh>
  );
}

// Component to animate the Sun's surface (pulsing/erupting effect)
export function SunEruption({ meshRef }: { meshRef: React.MutableRefObject<THREE.Mesh> }) {
  useFrame(() => {
    const time = performance.now() * 0.0001;
    if (meshRef.current) {
      meshRef.current.scale.set(
        1 + Math.sin(time * 5) * 0.02, // Pulsing animation along all axes
        1 + Math.sin(time * 5) * 0.02,
        1 + Math.sin(time * 5) * 0.02
      );
    }
  });

  return null; // This component only handles the frame-by-frame update
}
