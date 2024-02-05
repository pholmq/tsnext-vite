//test
import { createRef, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const trace = useStore((s) => s.trace);
  const posRef = useStore((s) => s.posRef);

  const plotObjects = usePlotStore((s) => s.plotObjects);
  const plotPosRef = useRef(0);
  const { traceLength, traceStepInput, tracedObjects } = useTraceStore();
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

  if (trace) {
    plotPosRef.current = posRef.current;
  } else {
    tracedObjects.map((tracedObj) => {
      tracedObj.pointsArrRef.current = [];
    });
  }

  for (let key in tracePlanets) {
    if (tracePlanets[key]) {
      const obj = plotObjects.find((item) => item.name === key);
      tracedObjects.push({
        name: key,
        obj: plotObjects.find((item) => item.name === key),
        pointsArrRef: createRef(),
      });
    }
  }

  // console.log(tracedObjects);

  useFrame(() => {
    if (!trace) return;

    //Check and adjust plotPos if the pos is out of bounds
    //This can be optimized...

    if (plotPosRef.current < posRef.current - traceLength * traceStep) {
      plotPosRef.current = posRef.current - traceLength * traceStep;
      tracedObjects.map((tracedObj) => {
        tracedObj.pointsArrRef.current = [];
      });
    }
    if (plotPosRef.current > posRef.current + traceLength * traceStep) {
      plotPosRef.current = posRef.current + traceLength * traceStep;
      tracedObjects.map((tracedObj) => {
        tracedObj.pointsArrRef.current = [];
      });
    }

    while (plotPosRef.current > posRef.current) {
      plotPosRef.current = plotPosRef.current - traceStep;

      tracedObjects.map((tracedObj) => {
        tracedObj.pointsArrRef.current.splice(
          tracedObj.pointsArrRef.current.length - 3,
          3
        );
      });
    }

    while (plotPosRef.current < posRef.current - traceStep) {
      plotPosRef.current = plotPosRef.current + traceStep;
      moveModel(plotObjects, plotPosRef.current);

      tracedObjects.map((tracedObj) => {
        tracedObj.obj.pivotRef.current.getWorldPosition(objectPos);
        if (tracedObj.pointsArrRef.current === null) {
          tracedObj.pointsArrRef.current = [];
        }
        if (tracedObj.pointsArrRef.current.length + 3 > traceLength * 3) {
          tracedObj.pointsArrRef.current.splice(0, 3);
        }
        tracedObj.pointsArrRef.current.push(
          objectPos.x,
          objectPos.y,
          objectPos.z
        );
        // console.log(tracedObj.pointsArrRef.current);
      });
    }
  });
  return (
    <>
      {Object.keys(tracePlanets).map((key, index) =>
        tracePlanets[key] ? <TraceLine key={index} name={key} /> : null
      )}
    </>
  );
}
