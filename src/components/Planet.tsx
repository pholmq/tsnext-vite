import { useRef, useState } from "react";
import { useStore } from "../store";
import { useTexture } from "@react-three/drei";
import { PosWriter } from "./PosWriter";
import { useControls } from "leva";

function PlanetTexture({ texture }) {
  const [planetTexture] = useTexture([texture]);
  return <meshStandardMaterial map={planetTexture} />;
}

export function Planet(props: any) {
  const ref: any = useRef();
  const posRef: any = useRef();
  // const [planetTexture] = useTexture([props.texture]);

  const [hovered, setHover] = useState(false);
  const [contextMenu, setContextMenu] = useState(false);

  const traceOn = useStore((s) => s.trace);

  return (
    <>
      <PosWriter
        hovered={hovered}
        contextMenu={contextMenu}
        name={props.name}
        symbol={props.unicodeSymbol}
      />
      <mesh
        name={props.name}
        visible={props.visible}
        ref={ref}
        scale={1}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHover(false);
          setContextMenu(false);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
          setContextMenu(true);
        }}
      >
        <sphereGeometry args={[props.size, 128, 128]} />
        {/* <meshStandardMaterial map={planetTexture} /> */}
        {props.texture !== "" ? (
          <PlanetTexture texture={props.texture} />
        ) : (
          <meshStandardMaterial color={props.color} />
        )}
        {props.light ? <pointLight intensity={3} /> : null}
      </mesh>
    </>
  );
}
