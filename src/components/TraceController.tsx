//test
import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore, usePlotStore, useTraceStore } from "../store";
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
  if (pointsArrRef.current === null) pointsArrRef.current = [];

  const traceStep = traceStepInput / 1000;

  const objMars = plotObjects.find((item) => item.name === "Mars");
  const objectPos = new Vector3();

  let float32arr = new Float32Array(traceLength * 3); //xyz(3) for each point
  float32arr.fill(0);

  useLayoutEffect(() => {
    if (traceOn) {
      plotPosRef.current = posRef.current;
    } else {
      pointsArrRef.current = [];
    }
  }, [traceOn]);

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

    while (plotPosRef.current < posRef.current - traceStep) {
      plotPosRef.current = plotPosRef.current + traceStep;
      moveModel(plotObjects, plotPosRef.current);
      objMars.pivotRef.current.getWorldPosition(objectPos);

      if (pointsArrRef.current.length + 3 > traceLength * 3) {
        pointsArrRef.current.splice(0, 3);
      }
      pointsArrRef.current.push(objectPos.x, objectPos.y, objectPos.z);
    }
  });

  return <>{traceOn ? <TraceLine /> : null}</>;
}
