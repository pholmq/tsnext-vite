import React, { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Matrix4 } from "three"; // Import from three
import { Html } from "@react-three/drei"; // For rendering HTML inside the 3D scene
import Papa from 'papaparse';

// Utility to parse CSV data using PapaParse
const parseCSV = (csvText) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true, // Assumes the first row is the header
      dynamicTyping: true, // Automatically converts numeric values
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

// Utility to convert RA/DEC to 3D position in space
const raDecToPosition = (ra, dec, distance = 25000) => {
  const phi = (ra / 180) * Math.PI; // Convert RA to radians
  const theta = ((90 - dec) / 180) * Math.PI; // Convert DEC to radians

  const x = distance * Math.sin(theta) * Math.cos(phi);
  const y = distance * Math.cos(theta);
  const z = distance * Math.sin(theta) * Math.sin(phi);

  return [x, y, z]; // Return array format for React Three Fiber
};

const ExoplanetStars = () => {
  // Hooks to manage stars data, loading, and error state
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleStars, setVisibleStars] = useState(4318); // Limit stars for performance
  const instancedRef = useRef(null); // Ref for InstancedMesh

  // Load the CSV file from the local filesystem and parse it using PapaParse
  const loadStarsFromCSV = async () => {
    try {
      const response = await fetch("/exoplanets_positions.csv"); // Path to the CSV file
      const csvText = await response.text();
      
      // Check if newlines are recognized properly
      console.log("Raw CSV Text:", csvText);
      
      const parsedStars = await parseCSV(csvText); // Parse the CSV
      console.log("Parsed Data:", parsedStars);
      
      setStars(parsedStars);
      setLoading(false);
    } catch (err) {
      console.error("Error loading stars from CSV:", err);
      setError(`Failed to load stars data: ${err.message}`);
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
      <sphereBufferGeometry args={[20, 16, 16]} />
      <meshBasicMaterial color="yellow" />
    </instancedMesh>
  );
};

export default ExoplanetStars;
