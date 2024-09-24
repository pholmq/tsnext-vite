import React, { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Matrix4 } from "three"; // Import from three
import { Html } from "@react-three/drei"; // For rendering HTML inside the 3D scene

// Utility to parse custom IPAC-like format for star data (hostname, ra, dec)
const parseIPACFormatCSV = (csvText: string) => {
  const lines = csvText.split("\n").filter((line) => line.trim() !== ""); // Split by line and filter empty lines
  
  // Skip the first four lines (headers, units, etc.)
  const dataLines = lines.slice(4); // The actual data starts from the 5th line

  // Parse each data line into objects
  const data = dataLines.map(line => {
    const [hostname, ra, dec] = line.trim().match(/\S+/g); // Split based on whitespace, taking care of spaces in hostnames
    return {
      hostname: hostname.trim(),
      ra: parseFloat(ra),
      dec: parseFloat(dec),
    };
  });
  
  return data;
};

// Utility to convert RA/DEC to 3D position in space
const raDecToPosition = (ra: number, dec: number, distance: number = 5000) => {
  const phi = (ra / 180) * Math.PI; // Convert RA to radians
  const theta = ((90 - dec) / 180) * Math.PI; // Convert DEC to radians

  const x = distance * Math.sin(theta) * Math.cos(phi);
  const y = distance * Math.cos(theta);
  const z = distance * Math.sin(theta) * Math.sin(phi);

  return [x, y, z]; // Return array format for React Three Fiber
};

interface StarData {
  hostname: string;
  ra: number;
  dec: number;
}

const ExoplanetStars: React.FC = () => {
  // Hooks to manage stars data, loading, and error state
  const [stars, setStars] = useState<StarData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleStars, setVisibleStars] = useState<number>(1000); // Limit stars for performance
  const instancedRef = useRef<any>(null); // Ref for InstancedMesh

  // Load the CSV file from the local filesystem
  const loadStarsFromCSV = async () => {
    try {
      const response = await fetch("exoplanets_positions.csv"); // Fetch the local CSV file
      const csvText = await response.text(); // Read the CSV file as text

      const parsedStars = parseIPACFormatCSV(csvText); // Parse the CSV
      setStars(parsedStars); // Set the parsed data in state
      setLoading(false);
    } catch (err) {
      console.error("Error loading stars from CSV:", err);
      setError('Failed to load stars data: ${err.message}');
      setLoading(false);
    }
  };

  // Load stars on component mount
  useEffect(() => {
    loadStarsFromCSV();
  }, []);

  useFrame(() => {
    if (instancedRef.current) {
      const tempMatrix = new Matrix4(); // Matrix4 from three

      stars.slice(0, visibleStars).forEach((star, index) => {
        const [x, y, z] = raDecToPosition(star.ra, star.dec);

        tempMatrix.setPosition(x, y, z);
        instancedRef.current.setMatrixAt(index, tempMatrix);
      });

      instancedRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Conditional rendering: always call hooks before conditionally rendering JSX
  if (loading) {
    return (
      <Html>
        <div>Loading...</div>
      </Html>
    );
  }
  if (error) {
    return (
      <Html>
        <div>Error: {error}</div>
      </Html>
    );
  }

  // Render stars using InstancedMesh for optimized performance with React Fiber components
  return (
    <instancedMesh ref={instancedRef} args={[null, null, visibleStars]}>
      <sphereBufferGeometry args={[6, 16, 16]} />
      <meshBasicMaterial color="yellow" />
    </instancedMesh>
  );
};

export default ExoplanetStars;