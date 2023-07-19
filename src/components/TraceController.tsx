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
  const traceOn = useStore((s) => s.trace);
  const [points, setPoints] = useState(null);
  // const { scene } = useThree();
  const positions = useRef([]);
  // const marsObj = useRef(null);

  // const plotPos = useStore.getState().plotPos;
  // const traceStep = useStore.getState().traceStep;
  // const posRef = useStore.getState().posRef;
  // const tracePosRef = useStore.getState().tracePosRef;
  // const plotPosRef = useStore.getState().plotPosRef;
  const { traceStep, posRef, tracePosRef, plotPosRef, plotObjects } =
    useStore.getState();
  let deltaSum = 0;

  // let index = 0;
  const pointsArr = [];
  const objectPos = new Vector3();
  let obj = plotObjects.find((item) => item.name === "Mars");
  // console.log(plotObjects)
  useFrame((state, delta) => {
    // console.log("blblblb")
    // deltaSum += delta;
    if (traceOn) {

      

      let pos = posRef.current;
      let trace = tracePosRef.current;
      // console.log("blblblb")
      // while (tracePosRef.current + traceStep < posRef.current) {
      //   tracePosRef.current = tracePosRef.current + traceStep;
      //   plotPosRef.current = tracePosRef.current;
      let update = false;
      while (trace + traceStep < pos) {
        trace += traceStep;
        plotPosRef.current = trace;
        obj.obj.updateMatrixWorld(true);
        obj.obj.getWorldPosition(objectPos);
        // console.log(objectPos)
        positions.current.push(objectPos);
        update = true;
      }
      if (update) {
        for (let i = 0; i < positions.current.length; i++) {
          pointsArr[i] = positions.current[i];
        }
        setPoints(pointsArr);
      }
      // useStore.setState({ plotPos: plotPos + traceStep });
      // while (useStore.getState().plotPos + traceStep < posRef.current) useStore.setState({ plotPos: plotPos + traceStep })
      // scene.getObjectByName("Mars").getWorldPosition(objectPos);
      // positions.current.push(objectPos);
      // for (let i = 0; i < positions.current.length; i++) {
      //   pointsArr[i] = positions.current[i];
      // }
      // setPoints(pointsArr);
      // deltaSum = 0;
    }
  });

  return;
  <>
    <Line
      visible={points ? true : false}
      points={points}
      linewidth={3}
      color="red"
    />
  </>;
  // <TraceLine points={points} />;
}
