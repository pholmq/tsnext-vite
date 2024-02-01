import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { useStore, usePlotStore, useTraceStore } from "../store";
import { Line } from "@react-three/drei";
import { Vector3, CatmullRomCurve3 } from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

function moveModel(plotObjects: any, plotPos: any) {
  plotObjects.forEach((pObj) => {
    // pObj.pivotRef.current.getWorldPosition(objectPos);
    // console.log(pObj.name, " ", objectPos);
    pObj.orbitRef.current.rotation.y =
      pObj.speed * plotPos - pObj.startPos * (Math.PI / 180);
    // console.log(pObj, "pObj.speed * plotPos: ", pObj.speed * plotPos);
  });
}

export default function TraceController() {
  const traceOn = useStore((s) => s.trace);
  const posRef = useStore((s) => s.posRef);

  const { plotPosRef, plotObjects } = usePlotStore();
  const { traceLength, traceStep, traceLinewidth } = useTraceStore();

  const objMars = plotObjects.find((item) => item.name === "Mars");
  const objectPos = new Vector3();
  const pointsArrRef = useRef([]);
  const line2Ref = useRef(null);
  let float32arr = new Float32Array(traceLength * 3); //xyz(3) for each point
  float32arr.fill(0);

  useLayoutEffect(() => {
    if (traceOn) {
      console.log("Trace on and initialized");
      plotPosRef.current = posRef.current;
      line2Ref.current.geometry.instanceCount = 0;
    } else {
      console.log("Trace is off");
    }
  }, []);

  console.log("Trace rerendered");

  useFrame(() => {
    if (!traceOn) return;
    let i = 0;
    while (plotPosRef.current < posRef.current - traceStep / 1000) {
      plotPosRef.current = plotPosRef.current + traceStep / 1000;
      moveModel(plotObjects, plotPosRef.current);
      objMars.pivotRef.current.getWorldPosition(objectPos);
      // console.log(objectPos.x);

      //we only update the line periodically for preformance
      i++;
      if (i > 1000) return;
      pointsArrRef.current.push(objectPos.x, objectPos.y, objectPos.z);
      float32arr.set(pointsArrRef.current); //bottleneck!
      // console.log(float32arr);
      line2Ref.current.geometry.setPositions(float32arr);
      line2Ref.current.geometry.instanceCount =
        (pointsArrRef.current.length - 1) / 3;
    }
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
