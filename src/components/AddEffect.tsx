import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";

// General effect-adding function
export function addEffect(effectType, objectRef) {
  const effect = useRef<THREE.Points>(null);

  useFrame(() => {
    if (effect.current) {
      // Add a default rotation or customize the effect's behavior
      effect.current.rotation.y += 0.002;
    }
  });

  switch (effectType) {
    case 'cometTrail':
      return <CometTrail ref={effect} attachTo={objectRef} />;
    case 'sunGlow':
      return <SunGlow ref={effect} attachTo={objectRef} />;
    default:
      return null;
  }
}

// Example comet trail effect component
const CometTrail = React.forwardRef(({ attachTo }, ref) => {
  const cometTexture = useTexture("/textures/comet_particle.png");

  // Define particle positions for comet trails
  const cometParticles = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 5;
      const y = (Math.random() - 0.5) * 5;
      const z = (Math.random() - 0.5) * 20;
      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, []);

  return (
    <group ref={ref} position={attachTo ? attachTo.current.position : [0, 0, 0]}>
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
          size={0.5}
          sizeAttenuation
          map={cometTexture}
          depthWrite={false}
        />
      </Points>
    </group>
  );
});

// Example sun glow effect component
const SunGlow = React.forwardRef(({ attachTo }, ref) => {
  const glowTexture = useTexture("/textures/glow_particle.png");

  // Define particle positions for sun glow
  const glowParticles = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;
      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, []);

  return (
    <group ref={ref} position={attachTo ? attachTo.current.position : [0, 0, 0]}>
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
          size={2}
          sizeAttenuation
          map={glowTexture}
          color="orange"
          depthWrite={false}
        />
      </Points>
    </group>
  );
});
