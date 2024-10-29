import { useState } from "react";
import { HoverMenu } from "../components/HoverMenu";

export default function PlanCamLookAt({ position, size = 2, color = "red" }) {
  const [hovered, setHover] = useState(false);

  return (
    <>
      <group position={position}>
        <HoverMenu hovered={hovered} name={"CameraTarget"} symbol={"X"} />

        <mesh
          name="CameraTarget"
          onPointerOver={(e) => {
            setHover(true);
          }}
          onPointerLeave={(e) => {
            setHover(false);
          }}
        >
          <sphereGeometry args={[size / 2, 32, 32]} />
          <meshBasicMaterial
            depthTest={false}
            color={color}
            opacity={0.5}
            transparent
          />
        </mesh>
      </group>
    </>
  );
}
