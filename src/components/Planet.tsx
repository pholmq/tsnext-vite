import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, useTexture, Html, Billboard } from "@react-three/drei";
import {
  Selection,
  Select,
  EffectComposer,
  SelectiveBloom
} from "@react-three/postprocessing";

// import PlanetCamera from "./PlanetCamera";


export function Planet(props: any) {
  const ref: any = useRef();
  // useFrame(() => {
  //   ref.current.rotation.y -= 0.0005;
  // });
  // const texture = props.texture;
  // const [cloudsMap, colorMap] = useTexture([
  const [planetTexture] = useTexture([props.texture]);
  // console.log(props);

  const [hovered, setHover] = useState(false);

  return (
    <>
      {hovered && (
        <Html position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
          <div className="planetLabel">
            {props.name} <br />
            RA:&nbsp;XXhXXmXXs Dec:&nbsp;+XX°XX&apos;XX&quot;
          </div>
        </Html>
      )}
      <mesh
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
        {props.light && <pointLight intensity={3} />}
      </mesh>
    </>
  );
}
