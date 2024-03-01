import { Vector3, Spherical, Scene, Camera } from "three";
export function getAllPositions() {}
export function getRaDecDistance(name: string, scene: Scene, camera: Camera) {
  //Returns Right Ascension, Declination and Distance for an object

  const objectPos = new Vector3();
  const lookAtDir = new Vector3(0, 0, 1);
  const csPos = new Vector3();
  const sphericalPos = new Spherical();
  const sunPos = new Vector3();

  //Some geometrical gymnastics to get Right Ascension, Declination, distance and elongation
  name === "Camera"
    ? objectPos.set(camera.position.x, camera.position.y, camera.position.z)
    : scene.getObjectByName(name).getWorldPosition(objectPos);
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
  let distAU;
  if (name === "Moon") {
    // Moon is furher away from Earth in the model than in reality (to be visible)
    distKm = (((sphericalPos.radius / 100) * 149597871) / 39.2078).toFixed(2);
    distAU = (sphericalPos.radius / 100 / 39.2078).toFixed(8);
  } else {
    distKm = ((sphericalPos.radius / 100) * 149597871).toFixed(2);
    distAU = (sphericalPos.radius / 100).toFixed(8);
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

  return {
    ra: ra,
    dec: dec,
    elongation: elongation,
    distKm: distKm,
    distAU: distAU,
    x: objectPos.x,
    y: objectPos.y,
    z: objectPos.z,
  };
}

export function radToRa(rad) {
  if (rad < 0) {
    rad = rad + Math.PI * 2;
  }
  const raDec = (rad * 12) / Math.PI;
  const hours = Math.floor(raDec);
  const minutesSeconds = (raDec - hours) * 60;
  const minutes = Math.floor((raDec - hours) * 60);
  const seconds = (minutesSeconds - minutes) * 60;
  return (
    leadZero(hours) +
    "h" +
    leadZero(minutes) +
    "m" +
    leadZero(Number(seconds.toFixed(0))) +
    "s"
  );
}

export function radToDec(rad) {
  if (rad <= 0) {
    rad = rad + Math.PI / 2;
  } else {
    rad = Math.PI / 2 - rad;
  }
  var degDec = (rad * 180) / Math.PI;
  var degreesSign = "";

  if (degDec < 0) {
    degDec *= -1.0;
    degreesSign = "-";
  }

  const degrees = Math.floor(degDec);
  const minutesSeconds = (degDec - degrees) * 60;
  const minutes = Math.floor((degDec - degrees) * 60);
  const seconds = (minutesSeconds - minutes) * 60;
  return (
    leadZero(Number(degreesSign + degrees), true) +
    "\xB0" +
    leadZero(minutes) +
    "'" +
    leadZero(Number(seconds.toFixed(0))) +
    '"'
  );
}

function leadZero(n: number, plus?: boolean) {
  let sign;
  n < 0 ? (sign = "-") : (sign = "");
  if (sign === "" && plus) {
    sign = "+";
  }
  n = Math.abs(n);
  return n > 9 ? sign + n : sign + "0" + n;
}
