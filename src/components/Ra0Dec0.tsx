import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { HoverMenu } from "./HoverMenu";

export default function Ra0Dec0() {
  const [hovered, setHover] = useState(false);

  return (
    <>
      <group position={[37.869, -0.054, 10]}>
        <HoverMenu hovered={hovered} name={"Ra0Dec0"} symbol={"X"} />

        <mesh
          name="Ra0Dec0"
          onPointerOver={(e) => {
            setHover(true);
          }}
          onPointerLeave={(e) => {
            setHover(false);
          }}
        >
          <sphereGeometry args={[0.1, 64, 64]} />
          <meshBasicMaterial color="white" opacity={0.5} transparent />
        </mesh>
      </group>
    </>
  );
}
