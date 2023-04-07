import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useStore } from "../store";
import { Line, Vector3 } from "three";
// import { Line } from "@react-three/drei";

export default function TraceObjects({}) {
  // const run = useStore((s) => s.run);
  // const ref = useRef(null);
  // const pointsRef = useRef([
  //   new Vector3(-2, 0, 0),
  //   new Vector3(0, 2, 0),
  //   new Vector3(2, 0, 0),
  // ]);
  // ref.current.setPoints(pointsRef.current);
  // const handleRandomize = () => {
  //   const newPoints = pointsRef.current.map((point) =>
  //     point.set(
  //       Math.random() * 4 - 2, // random x coordinate between -2 and 2
  //       Math.random() * 4 - 2, // random y coordinate between -2 and 2
  //       Math.random() * 4 - 2 // random z coordinate between -2 and 2
  //     )
  //   );
  //   pointsRef.current = newPoints;
  // };
  // handleRandomize();

  // const points = [
  //   new Vector3(-2, 0, 0),
  //   new Vector3(0, 2, 0),
  //   new Vector3(2, 0, 0),
  // ];

  // let deltaSum = 0;
  // useFrame((state, delta) => {
  //   if (run) {
  //     if (deltaSum > 10) {
  //       // handleRandomize();
  //       deltaSum = 0;
  //     }
  //   }
  // });

  // useLayoutEffect(() => {
  //   ref.current.setPoints(points);
  // }, []);

  // return (
  //   <>
  //     <Line ref={ref} points={[0, 0, 0]} color="red" lineWidth={2} />
  //   </>
  // );

  const lineRef = useRef();

  // Define the initial points for the line
  const points = [
    new Vector3(0, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(1, 1, 0),
    new Vector3(1, 0, 0),
    new Vector3(0, 0, 0),
  ];

  // Update the points in the line on every frame
  useFrame(() => {
    // Get the geometry of the line
    const geometry = lineRef.current.geometry;

    // Update the position of each point in the line
    points.forEach((point, index) => {
      geometry.vertices[index].copy(point);
    });

    // Mark the geometry as dirty to trigger an update
    geometry.verticesNeedUpdate = true;
    geometry.computeBoundingSphere();
  });

  // Return the Line component
  return (
    <Line ref={lineRef}>
      <geometry attach="geometry" vertices={points} />
      <lineBasicMaterial attach="material" color="red" />
    </Line>
  );
}
