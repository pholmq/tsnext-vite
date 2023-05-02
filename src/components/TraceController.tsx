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
  const traceOn = useStore((s) => s.trace);
  const [points, setPoints] = useState(null);
  const { scene } = useThree();
  const positions = useRef([]);
  const marsObj = useRef(null);

  let deltaSum = 0;

  const posArr = [];
  // let pointsArr = [];
  let index = 0;
  const pointsArr = [];
  useFrame((state, delta) => {
    deltaSum += delta;
    if (deltaSum > 0.1 && run && traceOn) {
      const objectPos = new Vector3();
      scene.getObjectByName("Mars").getWorldPosition(objectPos);
      positions.current.push(objectPos);

      for (let i = 0; i < positions.current.length; i++) {
        pointsArr[i] = positions.current[i];
      }
      setPoints(pointsArr);
      deltaSum = 0;
    }
  });

  // const pointsArr = [, new Vector3(0, 2, 0), new Vector3(2, 0, 0)];
  // postions.current = pointsArr;
  // setPoints(pointsArr);

  return <TraceLine points={points} />;
}
