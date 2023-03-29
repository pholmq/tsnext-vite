import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, useTexture, Html, Billboard } from "@react-three/drei";
import { Vector3, Spherical } from "three";
import { radToRa, radToDec } from "../utils/celestial-functions";
// import {
//   Selection,
//   Select,
//   EffectComposer,
//   SelectiveBloom
// } from "@react-three/postprocessing";

// import PlanetCamera from "./PlanetCamera";

export function Planet(props: any) {
  const ref: any = useRef();
  const posRef: any = useRef();
  // useFrame(() => {
  //   ref.current.rotation.y -= 0.0005;
  // });
  // const texture = props.texture;
  // const [cloudsMap, colorMap] = useTexture([
  const [planetTexture] = useTexture([props.texture]);
  // console.log(props);

  const [hovered, setHover] = useState(false);
  const { scene } = useThree();
  const planetPos = new Vector3();
  const lookAtDir = new Vector3(0, 0, 1);
  const csPos = new Vector3();
  const sphericalPos = new Spherical();

  if (hovered) {
    //Some geometrical gymnastics to get the Right Ascension, Declination and distance
    //to the planet hovered
    console.log(props.name + " hovered");
    scene.getObjectByName(props.name).getWorldPosition(planetPos);
    const csObj = scene.getObjectByName("CelestialSphere");
    const csLookAtObj = scene.getObjectByName("CSLookAtObj");
    csLookAtObj.lookAt(planetPos);
    lookAtDir.applyQuaternion(csLookAtObj.quaternion);
    lookAtDir.setLength(csPos.distanceTo(planetPos));
    sphericalPos.setFromVector3(lookAtDir);
    // console.log(radToRa(sphericalPos.theta));
    // console.log(radToDec(sphericalPos.phi));
    posRef.current.textContent = "RA: " + radToRa(sphericalPos.theta) + "Dec: " + radToDec(sphericalPos.phi);
  }

  return (
    <>
        <Html position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
          <div hidden={hovered ? false: true} className="text-white text-center select-none">
            {props.name} <br />
            <label ref={posRef}>
              RA:&nbsp;XXhXXmXXs Dec:&nbsp;+XX°XX&apos;XX&quot;
            </label>
          </div>
        </Html>
      {/* {hovered ? (
        <Html position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
          <div className="text-white text-center select-none">
            {props.name} <br />
            <div ref={posRef}>
              RA:&nbsp;XXhXXmXXs Dec:&nbsp;+XX°XX&apos;XX&quot;
            </div>
          </div>
        </Html>
      ) : null} */}
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
        {props.light && <pointLight intensity={3} />}
      </mesh>
    </>
  );
}
