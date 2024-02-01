import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore, usePlotStore, useTraceStore } from "../store";
import { Line } from "@react-three/drei";

export default function TraceLine() {
  const { traceLength, traceStepInput, traceLinewidth } = useTraceStore();

  // const pointsArrRef = useTraceStore((s) => s.pointsArrRef);

  let float32arr = new Float32Array(traceLength * 3); //xyz(3) for each point
  float32arr.fill(0);

  const line2Ref = useRef(null);

  // float32arr.set(pointsArrRef.current);

  // console.log(pointsArrRef.current);

  useLayoutEffect(() => {
    const pointsArrRef = useTraceStore.getState().pointsArrRef;
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
    const pointsArrRef = useTraceStore.getState().pointsArrRef;
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
