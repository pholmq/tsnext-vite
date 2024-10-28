import { Spherical, Vector3, Scene, Camera } from "three";
import { radToDec, radToRa } from "./celestial-functions";

export function getRaDecDirection(name: string, scene: Scene) {
  //Returns Right Ascension, Declination and Distance for an object

  const lookAtDir = new Vector3(0, 0, 1);
  const csPos = new Vector3();
  const sphericalPos = new Spherical();

  const object = scene.getObjectByName(name);

  // Get the object's forward direction
  const objectDirection = new Vector3(0, 0, -1);
  objectDirection.applyQuaternion(object.quaternion);

  // Calculate the target point
  const targetPoint = new Vector3();
  object.getWorldPosition(targetPoint);
  targetPoint.add(objectDirection.multiplyScalar(10)); // Adjust scale as needed

  scene.getObjectByName("CelestialSphere").getWorldPosition(csPos);
  const csLookAtObj = scene.getObjectByName("CSLookAtObj");

  csLookAtObj.lookAt(targetPoint);

  lookAtDir.applyQuaternion(csLookAtObj.quaternion);
  lookAtDir.setLength(csPos.distanceTo(targetPoint));
  sphericalPos.setFromVector3(lookAtDir);
  const ra = radToRa(sphericalPos.theta);
  const dec = radToDec(sphericalPos.phi);

  return {
    ra: ra,
    dec: dec,
  };
}
