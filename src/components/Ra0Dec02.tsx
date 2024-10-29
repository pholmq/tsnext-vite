import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { HoverMenu } from "./HoverMenu";

export default function Ra0Dec02() {
  const [hovered, setHover] = useState(false);

  return (
    <>
      <group position={[-60, -400, 100000]}>
        <HoverMenu hovered={hovered} name={"Ra0Dec02"} symbol={"X"} />

        <mesh
          name="Ra0Dec02"
          onPointerOver={(e) => {
            setHover(true);
          }}
          onPointerLeave={(e) => {
            setHover(false);
          }}
        >
          <sphereGeometry args={[100, 64, 64]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
    </>
  );
}
