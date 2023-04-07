import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Line({ points }) {
  const ref = useRef();
  const line = useRef();

  //   useFrame(() => {
  //     ref.current.geometry.verticesNeedUpdate = true;
  //   });

  //   const lineMaterial = new THREE.LineBasicMaterial({
  //     color: 0xffffff,
  //   });
  useLayoutEffect(() => {
    const geometry = line.current.geometry;
    // Bind the positions of the reflector to real line segments
    geometry.attributes.position = new THREE.BufferAttribute(
      reflect.current.positions,
      3
    );
    geometry.attributes.position.usage = THREE.DynamicDrawUsage;
    geometry.setDrawRange(0, 0);
  }, []);
  return (
    <line ref={line}>
      <lineBasicMaterial />
    </line>
  );
}

export default Line;
