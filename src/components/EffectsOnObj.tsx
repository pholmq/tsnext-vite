import React, { useMemo } from "react";
import { useTexture, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Store everything in misc-settings and or Zustand



export function EffectsOnObj({ effectType, position }: { effectType: string, position: [number, number, number] }) {
  if (effectType === 'cometTrail') {
    return <CometTrail position={position} />;
  } else if (effectType === 'sunGlow') {
    return <SunGlow position={position} />;
  }
  return null;
}

// Comet trail effect component
function CometTrail({ position }: { position: [number, number, number] }) {
  const cometTexture = useTexture("/textures/effects/glow_particle.png");

  // Number of particles for the comet trail
  const particleCount = 500;

  // Memoize the particle positions for comet trail
  const cometParticles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3); // x, y, z for each particle
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 5;
      const y = (Math.random() - 0.5) * 5;
      const z = (Math.random() - 0.5) * 20;
      positions.set([x, y, z], i * 3); // Set at index i*3 for x, y, z
    }
    return positions;
  }, [particleCount]);


  return (
    <group position={position}>
      <Points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={cometParticles}
            count={particleCount}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          opacity={0.8}
          size={1} // Adjust size for visibility
          sizeAttenuation
          map={cometTexture}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// Sun glow effect component
function SunGlow({ position }: { position: [number, number, number] }) {
  const glowTexture = useTexture("/textures/effects/glow_particle.png");

  // Number of particles for the sun glow
  const particleCount = 300;

  // Memoize the particle positions for the sun glow
  const glowParticles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3); // x, y, z for each particle
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 150;
      const y = (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 150;
      positions.set([x, y, z], i * 3); // Set at index i*3 for x, y, z
    }
    return positions;
  }, [particleCount]);

  return (
    <group position={position}>
      <Points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={glowParticles}
            count={particleCount}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          opacity={0.6}
          size={3} // Adjust size for the glow effect
          sizeAttenuation
          map={glowTexture}
          color="orange"
          depthWrite={false}
        />
      </Points>
    </group>
  );
}