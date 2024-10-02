import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Matrix4, Color, Vector3, InstancedMesh } from 'three'; // Import InstancedMesh for performance

// Fetch the star catalog data
const fetchStarData = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

// Utility: Convert RA/Dec to Cartesian
const parseRaDecToCartesian = (ra: string, dec: string, distance = 25000) => {
  const raParts = ra.match(/(\d+)h (\d+)m (\d+\.\d+)s/);
  const raHours = parseFloat(raParts[1]);
  const raMinutes = parseFloat(raParts[2]);
  const raSeconds = parseFloat(raParts[3]);
  const raDegrees = 15 * (raHours + raMinutes / 60 + raSeconds / 3600);

  const decParts = dec.match(/([+-]?\d+)° (\d+)′ (\d+)″/);
  const decDegrees = parseFloat(decParts[1]) + parseFloat(decParts[2]) / 60 + parseFloat(decParts[3]) / 3600;

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
    blue = temp <= 19 ? 0 : Math.max(138.5177312231 * Math.log(temp - 10) - 305.0447927307, 0);
  } else {
    red = Math.max(329.698727446 * Math.pow(temp - 60, -0.1332047592), 0);
    green = Math.max(288.1221695283 * Math.pow(temp - 60, -0.0755148492), 0);
    blue = 255;
  }

  // Return normalized RGB values (Clamp between 0 and 1)
  return [Math.min(1, red / 255), Math.min(1, green / 255), Math.min(1, blue / 255)];
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
  const [starData, setStarData] = useState<any[]>([]); // Initialize starData as an empty array
  const instancedRef = useRef<InstancedMesh>(null); // Ref for InstancedMesh
  const { camera } = useThree(); // Get the camera from useThree to track position

  // Fetch star data on component mount
  useEffect(() => {
    const url = 'exoplanets_positions.json'; // Replace with your data URL
    fetchStarData(url).then(data => {
      if (data && data.length) {
        setStarData(data); // Set starData once the data is fetched
      }
    });
  }, []);

  // REMOVE TO DEBUG STARS Shuffle the star array
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Calculate star positions and properties
  const starPositions = useMemo(() => {
    if (!starData || starData.length === 0) return []; // Return empty array if starData isn't available yet

    // Shuffle the star data array
    //const shuffledStarData = shuffleArray([...starData]); // spread to avoid mutating original array
    // Slice 850 random stars from the shuffled array
    const selectedStars = starData.slice(0, 9000);
    
    return selectedStars.map(star => {
      const { RA, Dec, K, V } = star;
      const position = parseRaDecToCartesian(RA, Dec);
      const color = colorTemperatureToRGB(K);
      const scale = starSizeByMagnitude(V);
      
      return { position, scale, color };
    });
  }, [starData]);

  // Update the positions and light intensities of the stars on each frame
  useFrame(() => {
    if (!instancedRef.current || starPositions.length === 0) return;

    const tempMatrix = new Matrix4();
    const cameraPosition = new Vector3().copy(camera.position); // Get current camera position

    starPositions.forEach((star, index) => {
      const [x, y, z] = star.position;
      tempMatrix.setPosition(x, y, z);
      instancedRef.current!.setMatrixAt(index, tempMatrix);

      // Calculate the distance from the camera to the star
      const starPosition = new Vector3(x, y, z);
      const distance = cameraPosition.distanceTo(starPosition);

      // Set color
      const [r, g, b] = star.color;
      const starColor = new Color(r, g, b);

      instancedRef.current!.setColorAt(index, starColor);

      // Ensure instanceMatrix and instanceColor updates
      if (instancedRef.current!.instanceMatrix) {
        instancedRef.current!.instanceMatrix.needsUpdate = true;
      }
      if (instancedRef.current!.instanceColor) {
        instancedRef.current!.instanceColor.needsUpdate = true;
      }
    });
  });

  // Return null if no stars are available
  if (starPositions.length === 0) return null;

  return (
    <instancedMesh ref={instancedRef} args={[null, null, starPositions.length]}>
      <sphereGeometry args={[9, 16, 16]} />
      <meshStandardMaterial emissiveIntensity={1} emissive={new Color(0, 0, 1)} /> {/* Adjust emissiveIntensity for glow */}
    </instancedMesh>
  );
};

export default ExoplanetStars;