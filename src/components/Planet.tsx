import { useRef, useState } from "react";
import { useStore } from "../store";
import { useTexture } from "@react-three/drei";
import { PosWriter } from "./PosWriter";

export function Planet(props: any) {
  const ref: any = useRef();
  const posRef: any = useRef();
  const [planetTexture] = useTexture([props.texture]);

  const [hovered, setHover] = useState(false);

  const traceOn = useStore((s) => s.trace);

  return (
    <>
      <PosWriter
        hovered={hovered}
        name={props.name}
        symbol={props.unicodeSymbol}
      />
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
