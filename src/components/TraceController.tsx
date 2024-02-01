import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore, usePlotStore, useTraceStore } from "../store";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";
import TraceLine from "./TraceLine";

function moveModel(plotObjects: any, plotPos: any) {
  plotObjects.forEach((pObj) => {
    pObj.orbitRef.current.rotation.y =
      pObj.speed * plotPos - pObj.startPos * (Math.PI / 180);
  });
}

export default function TraceController() {
  const traceOn = useStore((s) => s.trace);
  const posRef = useStore((s) => s.posRef);

  const { plotObjects } = usePlotStore();
  const plotPosRef = useRef(0);
  const { traceLength, traceStepInput, traceLinewidth, pointsArrRef } =
    useTraceStore();
  const traceStep = traceStepInput / 1000;

  const objMars = plotObjects.find((item) => item.name === "Mars");
  const objectPos = new Vector3();
  // const pointsArrRef = useTraceStore((s) => s.pointsArrRef);
  const line2Ref = useRef(null);
  let float32arr = new Float32Array(traceLength * 3); //xyz(3) for each point
  float32arr.fill(0);

  useLayoutEffect(() => {
    if (traceOn) {
      //Init trace
      plotPosRef.current = posRef.current;
      pointsArrRef.current = [];
      // line2Ref.current.geometry.instanceCount = 0;
    }
  }, [traceOn]);

  // useLayoutEffect(() => {
  //   if (float32arr.length < traceLength * 3) {
  //     float32arr = new Float32Array(traceLength * 3);
  //   }
  //   if (pointsArrRef.current.length > float32arr.length) {
  //     pointsArrRef.current.splice(
  //       0,
  //       pointsArrRef.current.length - float32arr.length + 3
  //     );
  //   }
  //   // float32arr.set(pointsArrRef.current);
  //   // line2Ref.current.geometry.setPositions(float32arr);
  //   // line2Ref.current.geometry.instanceCount =
  //   //   (pointsArrRef.current.length - 1) / 3;
  // }, [traceLength]);

  useFrame(() => {
    if (!traceOn) return;

    //Check and adjust plotPos if the pos is out of bounds
    if (plotPosRef.current < posRef.current - traceLength * traceStep) {
      plotPosRef.current = posRef.current - traceLength * traceStep;
      pointsArrRef.current = [];
    }
    if (plotPosRef.current > posRef.current + traceLength * traceStep) {
      plotPosRef.current = posRef.current + traceLength * traceStep;
      pointsArrRef.current = [];
    }

    while (plotPosRef.current > posRef.current) {
      plotPosRef.current = plotPosRef.current - traceStep;
      pointsArrRef.current.splice(pointsArrRef.current.length - 3, 3);
    }

    // let i = 0;
    while (plotPosRef.current < posRef.current - traceStep) {
      plotPosRef.current = plotPosRef.current + traceStep;
      moveModel(plotObjects, plotPosRef.current);
      objMars.pivotRef.current.getWorldPosition(objectPos);

      if (pointsArrRef.current.length + 3 > traceLength * 3) {
        pointsArrRef.current.splice(0, 3);
      }
      pointsArrRef.current.push(objectPos.x, objectPos.y, objectPos.z);
    }
    // float32arr.set(pointsArrRef.current); //bottleneck?
    // line2Ref.current.geometry.setPositions(float32arr);
    // line2Ref.current.geometry.instanceCount =
    //   (pointsArrRef.current.length - 1) / 3;
  });

  return (
    <TraceLine />

    // <Line
    //   ref={line2Ref}
    //   points={[...float32arr]}
    //   lineWidth={traceLinewidth}
    //   color="red"
    // ></Line>
  );
}
