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
  const sunPos = new Vector3();

  if (hovered) {
    //Some geometrical gymnastics to get Right Ascension, Declination, distance and elongation
    //on the planet hovered

    //RA and Dec
    scene.updateMatrixWorld();
    scene.getObjectByName(props.name).getWorldPosition(planetPos);
    scene.getObjectByName("CelestialSphere").getWorldPosition(csPos);
    const csLookAtObj = scene.getObjectByName("CSLookAtObj");
    csLookAtObj.lookAt(planetPos);
    lookAtDir.applyQuaternion(csLookAtObj.quaternion);
    lookAtDir.setLength(csPos.distanceTo(planetPos));
    sphericalPos.setFromVector3(lookAtDir);
    const ra = radToRa(sphericalPos.theta);
    const dec = radToDec(sphericalPos.phi);

    //Distance
    let distKm;
    let dist;
    if (props.name === "Moon") {
      console.log("moon");
      distKm = (((sphericalPos.radius / 100) * 149597871) / 39.2078).toFixed(2);
      dist = (sphericalPos.radius / 100 / 39.2078).toFixed(8);
    } else {
      distKm = ((sphericalPos.radius / 100) * 149597871).toFixed(2);
      dist = (sphericalPos.radius / 100).toFixed(8);
    }

    //Elongation
    scene.getObjectByName("Sun").getWorldPosition(sunPos);
    const earthSunDistance = csPos.distanceTo(sunPos);
    const earthTargetPlanetDistance = csPos.distanceTo(planetPos);
    const sunTargetPlanetDistance = sunPos.distanceTo(planetPos);
    const numerator =
      Math.pow(earthSunDistance, 2) +
      Math.pow(earthTargetPlanetDistance, 2) -
      Math.pow(sunTargetPlanetDistance, 2);
    const denominator = 2.0 * earthSunDistance * earthTargetPlanetDistance;
    const elongationRadians = Math.acos(numerator / denominator);
    const elongation = ((180.0 * elongationRadians) / Math.PI).toFixed(3);

    // console.log(radToRa(sphericalPos.theta));
    // console.log(radToDec(sphericalPos.phi));
    posRef.current.innerHTML =
      "RA:&nbsp;" +
      ra +
      "<br/>Dec:&nbsp;" +
      dec +
      "<br/>Km:&nbsp;" +
      distKm +
      "<br/>AU:&nbsp;" +
      dist +
      "<br/>Elongation:&nbsp;" +
      elongation;
  }

  return (
    <>
      <Html position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
        <div
          hidden={hovered ? false : true}
          className="text-white text-center select-none"
        >
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
