import React, { useState, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Matrix4, Color } from "three"; // Import Matrix4 and Color from three

// Fetch the star catalog data
const fetchStarData = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

// Utility: Convert RA/Dec to Cartesian
const parseRaDecToCartesian = (ra: string, dec: string, distance = 1000) => {
  const raParts = ra.match(/(\d+)h (\d+)m (\d+\.\d+)s/);
  const raHours = parseFloat(raParts[1]);
  const raMinutes = parseFloat(raParts[2]);
  const raSeconds = parseFloat(raParts[3]);
  const raDegrees = 15 * (raHours + raMinutes / 60 + raSeconds / 3600);

  const decParts = dec.match(/([+-]?\d+)° (\d+)′ (\d+)″/);
  const decDegrees =
    parseFloat(decParts[1]) +
    parseFloat(decParts[2]) / 60 +
    parseFloat(decParts[3]) / 3600;

  const raRadians = (raDegrees * Math.PI) / 180; // Convert to radians
  const decRadians = (decDegrees * Math.PI) / 180; // Convert to radians

  const x = distance * Math.cos(decRadians) * Math.cos(raRadians);
  const y = distance * Math.cos(decRadians) * Math.sin(raRadians);
  const z = distance * Math.sin(decRadians);

  return [x, y, z];
};

// Convert color temperature (Kelvin) to approximate RGB
const colorTemperatureToRGB = (kelvin: number) => {
  let temp = kelvin / 100;
  let red, green, blue;

  if (temp <= 66) {
    red = 255;
    green = Math.max(99.4708025861 * Math.log(temp) - 161.1195681661, 0);
    blue =
      temp <= 19
        ? 0
        : Math.max(138.5177312231 * Math.log(temp - 10) - 305.0447927307, 0);
  } else {
    red = Math.max(329.698727446 * Math.pow(temp - 60, -0.1332047592), 0);
    green = Math.max(288.1221695283 * Math.pow(temp - 60, -0.0755148492), 0);
    blue = 255;
  }

  // Return normalized RGB values (Clamp between 0 and 1)
  return [
    Math.min(1, red / 255),
    Math.min(1, green / 255),
    Math.min(1, blue / 255),
  ];
};

// Determine star size based on magnitude
const starSizeByMagnitude = (magnitude: number) => {
  if (magnitude < 1) return 12;
  if (magnitude < 3) return 6;
  if (magnitude < 5) return 3;
  return 1;
};

// Exoplanet stars visualization component
const ExoplanetStars = () => {
  const [starData, setStarData] = useState([]);
  const instancedRef = useRef<any>(null); // Ref for InstancedMesh

  useEffect(() => {
    const url =
      "https://raw.githubusercontent.com/pholmq/tsnova-resources/master/bsc5-short.json";
    fetchStarData(url).then(setStarData);
  }, []);

  const starPositions = useMemo(() => {
    return starData.slice(0, 100).map((star) => {
      const { RA, Dec, K, V } = star;
      const position = parseRaDecToCartesian(RA, Dec);
      const color = colorTemperatureToRGB(K);
      const scale = starSizeByMagnitude(V);

      console.log(`RA: ${RA}, Dec: ${Dec}, Cartesian: ${position}`);
      console.log(`Kelvin: ${K}, RGB: ${color}`);
      console.log(`Magnitude: ${V}, Size: ${scale}`);

      return { position, scale, color };
    });
  }, [starData]);

  useFrame(() => {
    // Ensure instancedRef is initialized and starPositions are loaded
    if (!instancedRef.current || starPositions.length === 0) return;

    const tempMatrix = new Matrix4();

    starPositions.forEach((star, index) => {
      const [x, y, z] = star.position;
      tempMatrix.setPosition(x, y, z);
      instancedRef.current.setMatrixAt(index, tempMatrix);

      // Set color
      const [r, g, b] = star.color;
      const starColor = new Color(r, g, b);
      console.log(`Setting Color at index ${index}:`, starColor);
      console.log(
        `Kelvin: ${star.color}, Setting Color at index ${index}:`,
        starColor
      );

      instancedRef.current.setColorAt(index, starColor);
    });

    // Check for valid instanceMatrix and instanceColor properties before updating
    if (instancedRef.current.instanceMatrix) {
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }

    if (instancedRef.current.instanceColor) {
      instancedRef.current.instanceColor.needsUpdate = true;
    }
  });

  // Return empty mesh if star data isn't loaded yet
  if (starPositions.length === 0) return null;

  return (
    <instancedMesh ref={instancedRef} args={[null, null, starPositions.length]}>
      <sphereGeometry args={[5, 16, 16]} />
      <meshBasicMaterial vertexColors={true} />
    </instancedMesh>
  );
};

export default ExoplanetStars;
