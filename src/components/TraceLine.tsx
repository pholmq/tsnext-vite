import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore, useTraceStore } from "../store";
import { Line } from "@react-three/drei";

export default function TraceLine({ name }) {
  console.log("Tracel rendered: ", name);
  // const { traceLength, traceStepInput, traceLinewidth, pointsArrRef } =
  //   useTraceStore();

  const {
    traceLength,
    traceStepInput,
    traceLinewidth,
    tracedObjects,
    // pointsArrRef,
  } = useTraceStore();

  // const tracedObjects = useTraceStore.getState().tracedObjects;
  const tracedObj = tracedObjects.find((item) => item.name === name);
  const pointsArrRef = tracedObj.pointsArrRef;
  if (pointsArrRef.current === null) {
    pointsArrRef.current = [];
  }
  // console.log(tracedObj, pointsArrRef, pointsArrRef);

  const traceDots = useStore((s) => s.traceDots);

  //If lineWidth is a negative number the line is dotted
  const linewOrDotSize = traceDots ? -traceLinewidth : traceLinewidth;

  let float32arr = new Float32Array(traceLength * 3); //xyz for each point
  float32arr.fill(0);

  const line2Ref = useRef(null);

  // Note: Animating lines in Three.js is tricky. The array that geometry.setPositions receive
  // must be a Float32 array of the same length and be filled [x,y,z,x,y,z...] .
  // So to acheive a line that becomes progessively longer we fill the array with zeroes
  // and then increase geometry.instanceCount that sets how many points in the array that is
  // actually drawn.

  useLayoutEffect(() => {
    if (float32arr.length < traceLength * 3) {
      float32arr = new Float32Array(traceLength * 3);
    }
    if (pointsArrRef.current.length > float32arr.length) {
      pointsArrRef.current.splice(
        0,
        pointsArrRef.current.length - float32arr.length + 3
      );
    }
    float32arr.set(pointsArrRef.current);
    line2Ref.current.geometry.setPositions(float32arr);
    line2Ref.current.geometry.instanceCount =
      (pointsArrRef.current.length - 1) / 3;
  }, [traceLength]);

  useFrame(() => {
    // console.log(name);
    float32arr.set(pointsArrRef.current); //bottleneck?
    line2Ref.current.geometry.setPositions(float32arr);
    line2Ref.current.geometry.instanceCount =
      (pointsArrRef.current.length - 1) / 3;
  });

  return (
    <Line
      ref={line2Ref}
      points={[...float32arr]}
      lineWidth={linewOrDotSize}
      color={tracedObj.obj.color}
    ></Line>
  );
}
