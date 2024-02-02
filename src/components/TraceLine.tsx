import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTraceStore } from "../store";
import { Line } from "@react-three/drei";

export default function TraceLine() {
  const { traceLength, traceStepInput, traceLinewidth, pointsArrRef } =
    useTraceStore();

  let float32arr = new Float32Array(traceLength * 3); //xyz(3) for each point
  float32arr.fill(0);

  const line2Ref = useRef(null);

  // Note: Animating lines in Three.js are tricky. The array that setPositions receive
  // must be a float32 array of the same length and be filled [x,y,z,x,y,z...] .
  // So to acheive a line that becomes progessively longer we fill the array with zeroes
  // and then increase instanceCount that sets how many points in the array that is actually drawn.

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
    float32arr.set(pointsArrRef.current); //bottleneck?
    line2Ref.current.geometry.setPositions(float32arr);
    line2Ref.current.geometry.instanceCount =
      (pointsArrRef.current.length - 1) / 3;
  });

  return (
    <Line
      ref={line2Ref}
      points={[...float32arr]}
      lineWidth={traceLinewidth}
      color="red"
    ></Line>
  );
}
