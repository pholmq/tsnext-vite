import React, { useMemo } from "react";
import { useTexture, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Function to return the appropriate effect component
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

  // Memoize the particle positions for comet trail
  const cometParticles = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 150;
      const y = (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 20;
      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, []);

  return (
    <group position={position}>
      <Points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={cometParticles}
            count={500}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          opacity={0.8}
          size={10000000} // Adjust size for visibility
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

  // Memoize the particle positions for the sun glow
  const glowParticles = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const x = (Math.random() - 0.5) * 1500;
      const y = (Math.random() - 0.5) * 1500;
      const z = (Math.random() - 0.5) * 1500;
      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, []);

  return (
    <group position={position}>
      <Points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={glowParticles}
            count={300}
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
