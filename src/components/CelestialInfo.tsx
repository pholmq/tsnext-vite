import { useRef } from "react";
import { Html } from "@react-three/drei";
import { Vector3, Spherical } from "three";
import { useThree } from "@react-three/fiber";
import { radToRa, radToDec } from "../utils/celestial-functions";
export function CelestialInfo({ hovered, name, symbol = "*" }) {
  const ref: any = useRef();
  const { scene } = useThree();

  const objectPos = new Vector3();
  const lookAtDir = new Vector3(0, 0, 1);
  const csPos = new Vector3();
  const sphericalPos = new Spherical();
  const sunPos = new Vector3();

  if (hovered) {
    //Some geometrical gymnastics to get Right Ascension, Declination, distance and elongation
    //on the object hovered

    //RA and Dec
    scene.updateMatrixWorld();
    scene.getObjectByName(name).getWorldPosition(objectPos);
    scene.getObjectByName("CelestialSphere").getWorldPosition(csPos);
    const csLookAtObj = scene.getObjectByName("CSLookAtObj");
    csLookAtObj.lookAt(objectPos);
    lookAtDir.applyQuaternion(csLookAtObj.quaternion);
    lookAtDir.setLength(csPos.distanceTo(objectPos));
    sphericalPos.setFromVector3(lookAtDir);
    const ra = radToRa(sphericalPos.theta);
    const dec = radToDec(sphericalPos.phi);

    //Distance
    let distKm;
    let dist;
    if (name === "Moon") {
      // console.log("moon");
      distKm = (((sphericalPos.radius / 100) * 149597871) / 39.2078).toFixed(2);
      dist = (sphericalPos.radius / 100 / 39.2078).toFixed(8);
    } else {
      distKm = ((sphericalPos.radius / 100) * 149597871).toFixed(2);
      dist = (sphericalPos.radius / 100).toFixed(8);
    }

    //Elongation
    scene.getObjectByName("Sun").getWorldPosition(sunPos);
    const earthSunDistance = csPos.distanceTo(sunPos);
    const earthTargetPlanetDistance = csPos.distanceTo(objectPos);
    const sunTargetPlanetDistance = sunPos.distanceTo(objectPos);
    const numerator =
      Math.pow(earthSunDistance, 2) +
      Math.pow(earthTargetPlanetDistance, 2) -
      Math.pow(sunTargetPlanetDistance, 2);
    const denominator = 2.0 * earthSunDistance * earthTargetPlanetDistance;
    const elongationRadians = Math.acos(numerator / denominator);
    const elongation = ((180.0 * elongationRadians) / Math.PI).toFixed(3);

    // console.log(radToRa(sphericalPos.theta));
    // console.log(radToDec(sphericalPos.phi));
    ref.current.innerHTML =
      name +
      " " +
      symbol +
      "<br/>" +
      "RA:&nbsp;" +
      ra +
      "<br/>Dec:&nbsp;" +
      dec +
      "<br/>Km:&nbsp;" +
      distKm +
      "<br/>AU:&nbsp;" +
      dist +
      "<br/>Elongation:&nbsp;" +
      elongation +
      "\xB0" +
      "<br/>X:&nbsp;" +
      objectPos.x +
      "<br/>Y:&nbsp;" +
      objectPos.y +
      "<br/>Z:&nbsp;" +
      objectPos.z;
  }

  return (
    <Html position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
      <div
        hidden={hovered ? false : true}
        className="text-white text-center select-none"
      >
        <label ref={ref}>
          RA:&nbsp;XXhXXmXXs Dec:&nbsp;+XX°XX&apos;XX&quot;
        </label>
      </div>
    </Html>
  );
}
