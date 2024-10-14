import { useRef, useMemo } from "react";
import {useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export function AsteroidBelt({ numAsteroids = 1000, innerRadius = 5, outerRadius = 7 }) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);

  const [asteroidTexture] = useTexture(["/textures/asteroid.webp"]);
  /* Kommentar!  */
  // Memoize asteroid data (positions, scales, rotations)
  const asteroids = useMemo(() => {
    const positions = [];
    const scales = [];
    const rotations = [];

    for (let i = 0; i < numAsteroids; i++) {
      // Generate random positions in a circular belt between inner and outer radius
      const angle = Math.random() * 2 * Math.PI;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 12;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.1;
      const y = Math.random() * 1.3; // Keep asteroids mostly in a flat plane

      positions.push(new THREE.Vector3(x, y, z));

      // Generate random scale for each asteroid
      const scale = Math.random() * 0.1 + 0.001; // Small random sizes
      scales.push(scale);

      // Generate random rotations for each asteroid
      rotations.push(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI));
    }

    return { positions, scales, rotations };
  }, [numAsteroids, innerRadius, outerRadius]);

  // Apply random rotation to each asteroid every frame for more dynamism
  useFrame(() => {
    if (!meshRef.current) return; // Add this null check

    for (let i = 0; i < numAsteroids; i++) {
      const id = i;
      const rotation = asteroids.rotations[i];
      rotation.x += 0.01;
      rotation.y += 0.01;
      rotation.z += 0.01;
      meshRef.current.setMatrixAt(
        id,
        new THREE.Matrix4().compose(
          asteroids.positions[i],
          new THREE.Quaternion().setFromEuler(rotation),
          new THREE.Vector3(asteroids.scales[i], asteroids.scales[i], asteroids.scales[i])
        )
      );
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, numAsteroids]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial map={asteroidTexture} />
    </instancedMesh>
  );
}
