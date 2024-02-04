//test
import { createRef, useLayoutEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore, usePlotStore, useTraceStore } from "../store";
import { Vector3 } from "three";
import TraceLine from "./TraceLine";
import { useControls } from "leva";

function moveModel(plotObjects: any, plotPos: any) {
  plotObjects.forEach((pObj) => {
    pObj.orbitRef.current.rotation.y =
      pObj.speed * plotPos - pObj.startPos * (Math.PI / 180);
  });
}

export default function TraceController() {
  // const { trace, posRef } = useStore();
  const trace = useStore((s) => s.trace);
  const posRef = useStore((s) => s.posRef);

  const plotObjects = usePlotStore((s) => s.plotObjects);
  const plotPosRef = useRef(0);
  const { traceLength, traceStepInput, pointsArrRef, tracedObjects } =
    useTraceStore();
  // if (pointsArrRef.current === null) pointsArrRef.current = [];

  const traceStep = traceStepInput / 1000;

  const objMars = plotObjects.find((item) => item.name === "Mars");
  // let tracedObjects = [];
  const objectPos = new Vector3();

  let float32arr = new Float32Array(traceLength * 3); //xyz(3) for each point
  float32arr.fill(0);

  // const {Mars} = useControls("Trace planets", {"Mars": false})
  const tracePlanets = useControls("Trace settings", {
    "Planets:": { value: "", editable: false },
    Moon: false,
    Sun: false,
    Mars: false,
    Venus: false,
    Mercury: false,
  });

  useLayoutEffect(() => {
    if (trace) {
      plotPosRef.current = posRef.current;
    } else {
      pointsArrRef.current = [];
    }
  }, [trace]);

  useLayoutEffect(() => {
    // for (let key in tracePlanets) {
    //   console.log(key, tracePlanets[key]);
    // }
    tracedObjects.length = 0;

    for (let key in tracePlanets) {
      if (tracePlanets[key]) {
        tracedObjects.push({
          name: key,
          obj: plotObjects.find((item) => item.name === key),
          pointsArrRef: createRef(),
        });
      }
      // console.log(tracedObjectsRef.current);
    }
    console.log("tracedObjects: ", tracedObjects);
  }, [tracePlanets]);

  useFrame(() => {
    if (!trace) return;

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

      tracedObjects.map((tracedObj) => {
        tracedObj.obj.pivotRef.current.getWorldPosition(objectPos);
        if (tracedObj.pointsArrRef.current === null) {
          tracedObj.pointsArrRef.current = [];
        }
        tracedObj.pointsArrRef.current.push(objectPos);
        // console.log(tracedObj.pointsArrRef.current);
      });
    }
  });
  //       {/* {tracedObjects.length > 0
  //         ? tracedObjects.map((tracedObj) => (
  //             <TraceLine key={tracedObj.name} name={tracedObj.name} />
  //           ))
  //         : null}
  //  */}
  //       {/* {trace ? <TraceLine /> : null} */}

  return (
    <>
      {tracedObjects.length > 0
        ? tracedObjects.map((tracedObj) => (
            <TraceLine key={tracedObj.name} name={tracedObj.name} />
          ))
        : null}
    </>
  );
}
