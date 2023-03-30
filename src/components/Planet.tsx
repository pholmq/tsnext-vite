import { useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { PlanetInfo } from "./PlanetInfo";

export function Planet(props: any) {
  const ref: any = useRef();
  const posRef: any = useRef();
  const [planetTexture] = useTexture([props.texture]);

  const [hovered, setHover] = useState(false);

  return (
    <>
      <PlanetInfo hovered={hovered} name={props.name} unicode={props.unicodeSymbol} />
      <mesh
        name={props.name}
        ref={ref}
        scale={1}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHover(false);
        }}
      >
        <sphereGeometry args={[props.size, 128, 128]} />
        <meshStandardMaterial map={planetTexture} />
        {props.light ? <pointLight intensity={3} /> : null}
      </mesh>
    </>
  );
}
