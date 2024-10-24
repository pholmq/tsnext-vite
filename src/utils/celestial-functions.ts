import { Vector3, Spherical, Scene, Camera } from "three";

export function decFromAzAltLat(az: number, alt: number, lat: number): number {
  // Convert degrees to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const toDegrees = (radians: number) => (radians * 180) / Math.PI;

  // Convert inputs to radians
  const azRad = toRadians(az);
  const altRad = toRadians(alt);
  const latRad = toRadians(lat);

  // Calculate declination
  const sinDec =
    Math.sin(altRad) * Math.sin(latRad) +
    Math.cos(altRad) * Math.cos(latRad) * Math.cos(azRad);
  const dec = Math.asin(sinDec);

  // Convert declination to degrees and return
  return toDegrees(dec);
}

export function rAandDecFromLocal(lat, lon, time, az, alt) {
  // Convert degrees to radians
  const toRadians = (deg) => deg * (Math.PI / 180);
  const toDegrees = (rad) => rad * (180 / Math.PI);

  // Convert input to radians
  lat = toRadians(lat);
  lon = toRadians(lon);
  az = toRadians(az);
  alt = toRadians(alt);

  // Calculate Local Sidereal Time (LST)
  const date = new Date(time);
  const utc =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;
  const jd = date.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525;
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * t * t -
    (t * t * t) / 38710000;
  let lst = (gmst + lon * (180 / Math.PI)) % 360;
  lst = toRadians(lst);

  // Calculate declination
  const sinDec =
    Math.sin(lat) * Math.sin(alt) +
    Math.cos(lat) * Math.cos(alt) * Math.cos(az);
  const decRad = Math.asin(sinDec);

  // Calculate hour angle
  const cosH =
    (Math.sin(alt) - Math.sin(lat) * Math.sin(decRad)) /
    (Math.cos(lat) * Math.cos(decRad));
  let h = Math.acos(cosH);
  if (Math.sin(az) > 0) {
    h = 2 * Math.PI - h;
  }

  // Calculate right ascension
  let ra = lst - h;
  if (ra < 0) ra += 2 * Math.PI;
  if (ra > 2 * Math.PI) ra -= 2 * Math.PI;

  // Convert RA to hours and Dec to degrees
  ra = toDegrees(ra) / 15; // 15 degrees per hour
  const dec = toDegrees(decRad);

  return { ra, dec };
  /* Example usage
const lat = 40.7128; // New York City latitude
const lon = -74.0060; // New York City longitude
const time = new Date(); // Current time
const az = 180; // Azimuth in degrees
const alt = 45; // Altitude in degrees

const result = calculateRAandDec(lat, lon, time, az, alt);
console.log(`Right Ascension: ${result.ra.toFixed(4)} hours`);
console.log(`Declination: ${result.dec.toFixed(4)} degrees`);
*/
}

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
