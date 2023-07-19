import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useStore } from "../store";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";

function TraceLine({ points }) {
  return (
    <>
      <Line points={points} linewidth={3} color="red" />
    </>
  );
}

export default function TraceController() {
  const traceOn = useStore((s) => s.trace);
  // const [points, setPoints] = useState([[0, 0, 0]]);
  // const { scene } = useThree();
  const positions = useRef([]);
  // const marsObj = useRef(null);

  const lineRef = useRef(null);

  // const plotPos = useStore.getState().plotPos;
  // const traceStep = useStore.getState().traceStep;
  // const posRef = useStore.getState().posRef;
  // const tracePosRef = useStore.getState().tracePosRef;
  // const plotPosRef = useStore.getState().plotPosRef;
  const { traceStep, posRef, tracePosRef, plotPosRef, plotObjects } =
    useStore.getState();
  let deltaSum = 0;

  // let index = 0;
  // const pointsArr = [];
  const objectPos = new Vector3();
  let obj = plotObjects.find((item) => item.name === "Mars");
  // console.log(plotObjects)
  useFrame((state, delta) => {
    // console.log("blblblb")
    // deltaSum += delta;
    if (traceOn) {
      // let pos = posRef.current;
      // let trace = tracePosRef.current;
      // console.log("blblblb")
      // while (tracePosRef.current + traceStep < posRef.current) {
      //   tracePosRef.current = tracePosRef.current + traceStep;
      //   plotPosRef.current = tracePosRef.current;
      // let update = false;
      // while (trace + traceStep < pos) {
      //   trace += traceStep;
      //   plotPosRef.current = trace;
      //   obj.obj.updateMatrixWorld(true);
      //   obj.obj.getWorldPosition(objectPos);
      //   // console.log(objectPos)
      //   positions.current.push(objectPos);
      //   update = true;
      // }
      // if (update) {
      //   for (let i = 0; i < positions.current.length; i++) {
      //     pointsArr[i] = positions.current[i];
      //   }
      //   setPoints(pointsArr);
      // }
      // useStore.setState({ plotPos: plotPos + traceStep });
      // while (useStore.getState().plotPos + traceStep < posRef.current) useStore.setState({ plotPos: plotPos + traceStep })
      // scene.getObjectByName("Mars").getWorldPosition(objectPos);
      // positions.current.push(objectPos);
      // for (let i = 0; i < positions.current.length; i++) {
      //   pointsArr[i] = positions.current[i];
      // }
      // setPoints(pointsArr);
      // deltaSum = 0;
      // setPoints( [
      //   [0, 0, 0],
      //   [10, 0, 0],])
      // points[1].set(0, 10, 0);
      // console.log(lineRef.current.geometry)

      // lineRef.current.geometry.dispose()
      // lineRef.current.geometry.setFromPoints([new Vector3(0, 0, 0), new Vector3(-10, 0, 0)])

      if (tracePosRef.current + traceStep < posRef.current) {
        tracePosRef.current = tracePosRef.current + traceStep;
        plotPosRef.current = tracePosRef.current;
        obj.obj.getWorldPosition(objectPos);
        pointsArrRef.current.push(objectPos);
        setPoints([...pointsArrRef.current]);
        // pointsRef.current = [...pointsArrRef.current];
        // console.log(pointsRef.current)
      }
    }
  });
  // const points = [new Vector3(0, 0, 0), new Vector3(10, 0, 0)];
  const [points, setPoints] = useState([new Vector3(0, 0, 0)]);
  const pointsRef = useRef([new Vector3(0, 0, 0)]);
  const pointsArrRef = useRef([]);
  // if (traceOn) {
  //   console.log("hello");
  //   pointsRef.current = [
  //     new Vector3(0, 0, 0),
  //     new Vector3(-10, 0, 0),
  //     new Vector3(0, 10, 0),
  //   ];
  // }

  // lineRef.geometry.attributes.position.needsUpdate = true
  return (
    <>
    <TraceLine points={points} />
    {/* <Line ref={lineRef} points={points} linewidth={3} color="red" /> */}
    </>
  );
  // <TraceLine points={points} />;
}
