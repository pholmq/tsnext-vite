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
      <PlanetInfo hovered={hovered} name={props.name} />
      <mesh
        name={props.name}
        ref={ref}
        scale={1}
        // { e.stopPropagation(); handleT(); }}
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
        {/* <meshPhongMaterial specularMap={specularMap} /> */}
        <meshStandardMaterial
          map={planetTexture}
          // normalMap={normalMap}
          // metalness={0.4}
          // roughness={0.7}
          // side={DoubleSide}
        />
        {/* <PlanetCamera /> */}
        {/* {props.glow && (
          <EffectComposer>
            {" "}
            <SelectiveBloom
              mipmapBlur
              radius={0.5}
              luminanceThreshold={0.001}
              intensity={5}
            />{" "}
          </EffectComposer>
        )} */}
        {props.light ? <pointLight intensity={3} />: null}
      </mesh>
    </>
  );
}
