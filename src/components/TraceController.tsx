import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useStore } from "../store";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";

function TraceLine({ points }) {
  return (
    <>{points ? <Line points={points} linewidth={3} color="red" /> : null}</>
  );
}

export default function TraceController() {
  const run = useStore((s) => s.run);
  const [points, setPoints] = useState(null);
  let deltaSum = 0;
  const { scene } = useThree();
  const postions = useRef([]);
  useFrame((state, delta) => {
    if (run) {
      deltaSum += delta;
      // if (deltaSum > 0.1) {
      const csPos = new Vector3();
      scene.getObjectByName("Mars").getWorldPosition(csPos);
      postions.current.push(csPos);
      // const points = Array.from({ length: 3 }).map(() => {
      //   const angle = (index + tickRef.current) * res
      // const points = [
      //   new Vector3(-20, 0, 0),
      //   new Vector3(0, 2, 0),
      //   new Vector3(2, 0, 0),
      // ];
      //   return [extent * Math.sin(angle * x_period), extent * Math.cos(angle * y_period), 0]
      // })
      console.log(postions.current);
      setPoints(postions.current);
      deltaSum = 0;
      // }
    }
  });
  return <TraceLine points={points} />;
}
