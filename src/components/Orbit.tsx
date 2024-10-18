import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../store";
import { Line } from "@react-three/drei";

type ArrowProps = {
  rotation: number;
  radius: number;
  color: string;
  reverse?: boolean;
};

const Arrow = ({ rotation, radius, color, reverse = false }: ArrowProps) => {
  const arrowScale = useStore((s) => s.arrowScale);
  const arrowDirection = reverse ? Math.PI : 0;

  return (
    <group rotation={[0, 0, rotation]}>
      <mesh position={[radius, 0, 0]} rotation={[0, 0, arrowDirection]} scale={arrowScale}>
        <coneGeometry args={[3, 8]} />
        <meshBasicMaterial color={color} opacity={0.8} transparent />
      </mesh>
    </group>
  );
};

type OrbitProps = {
  radius: number;
  color: string;
  lineWidth: number;
  arrows?: boolean;
  reverse?: boolean;
  rotation?: number;
};

export const Orbit = ({
  radius,
  color,
  lineWidth,
  arrows = false,
  reverse = false,
}: OrbitProps) => {
  const orbitRef = useRef();
  const showArrows = useStore((s) => s.arrows);
  const showOrbits = useStore((s) => s.orbits);
  const orbitsLinewidth = useStore((s) => s.orbitsLinewidth);

  const points: [number, number, number][] = Array.from({ length: 361 }, (_, i) => [
    Math.sin(i * (Math.PI / 180)) * radius,
    Math.cos(i * (Math.PI / 180)) * radius,
    0,
  ]);

  const arrowRotations = Array.from({ length: 4 }, (_, i) => (Math.PI / 4) * (2 * i + 1));

  return (
    <group ref={orbitRef} visible={showOrbits}>
      {arrows && showArrows && (
        <group>
          {arrowRotations.map((rot, idx) => (
            <Arrow key={idx} rotation={rot} radius={radius} color={color} reverse={reverse} />
          ))}
        </group>
      )}

      <Line points={points} color={color} lineWidth={orbitsLinewidth} dashed={false} />
    </group>
  );
};
