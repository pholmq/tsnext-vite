import { createRef, useEffect, useRef } from "react";
import { useStore, usePlotStore, useTraceStore } from "../store";
import { Vector3 } from "three";
import TraceLine from "./TraceLine";
import { useControls } from "leva";
import { useFrameInterval } from "../utils/useFrameInterval";

function moveModel(plotObjects, plotPos) {
  plotObjects.forEach((pObj) => {
    if (pObj.orbitRef?.current) {
      pObj.orbitRef.current.rotation.y = pObj.speed * plotPos - pObj.startPos * (Math.PI / 180);
    }
  });
}

export default function TraceController() {
  const trace = useStore((s) => s.trace);
  const posRef = useStore((s) => s.posRef);
  const plotObjects = usePlotStore((s) => s.plotObjects);
  const plotPosRef = useRef(0);
  const {
    traceLength,
    stepFact,
    stepMultiplier,
    traceInterval,
    traceStartPosRef,
    tracedObjects,
  } = useTraceStore();

  const traceStep = stepFact * stepMultiplier;
  const objectPos = new Vector3();
  const plotObjectsReady = plotObjects.length > 0;

  const tracePlanets = useControls("Trace settings", {
    "Planets:": { value: "", editable: false },
    Moon: false,
    Sun: false,
    Mars: true,
    Venus: false,
    Mercury: false,
    Jupiter: false,
    Saturn: false,
    Uranus: false,
    Neptune: false,
    Halleys: false,
    Eros: false,
  });

  useEffect(() => {
    plotPosRef.current = traceStartPosRef.current;
    tracedObjects.forEach((tracedObj) => {
      if (tracedObj.pointsArrRef) {
        tracedObj.pointsArrRef.current = [];
      }
    });
  }, [traceStartPosRef, tracedObjects]);

  useEffect(() => {
    if (trace) {
      plotPosRef.current = traceStartPosRef.current = posRef.current;
    } else {
      tracedObjects.forEach((tracedObj) => {
        if (tracedObj.pointsArrRef) {
          tracedObj.pointsArrRef.current = [];
        }
      });
    }
  }, [trace, tracedObjects, posRef]);

  useEffect(() => {
    if (plotObjectsReady) {
      Object.keys(tracePlanets).forEach((key) => {
        if (tracePlanets[key] && !tracedObjects.find((item) => item.name === key)) {
          const plotObject = plotObjects.find((item) => item.name === key);
          if (plotObject) {
            tracedObjects.push({
              name: key,
              obj: plotObject,
              pointsArrRef: createRef(),
            });
          }
        }
      });
    }
  }, [tracePlanets, tracedObjects, plotObjects, plotObjectsReady]);

  useFrameInterval(() => {
    if (!trace) return;

    if (plotPosRef.current < posRef.current - traceLength * traceStep) {
      plotPosRef.current = posRef.current - traceLength * traceStep;
      tracedObjects.forEach((tracedObj) => {
        if (tracedObj.pointsArrRef) {
          tracedObj.pointsArrRef.current = [];
        }
      });
    }
    if (plotPosRef.current > posRef.current + traceLength * traceStep) {
      plotPosRef.current = posRef.current + traceLength * traceStep;
      tracedObjects.forEach((tracedObj) => {
        if (tracedObj.pointsArrRef) {
          tracedObj.pointsArrRef.current = [];
        }
      });
    }

    while (plotPosRef.current < posRef.current - traceStep) {
      plotPosRef.current += traceStep;
      moveModel(plotObjects, plotPosRef.current);

      tracedObjects.forEach((tracedObj) => {
        if (tracedObj.obj?.pivotRef?.current) {
          tracedObj.obj.pivotRef.current.getWorldPosition(objectPos);
          if (!tracedObj.pointsArrRef.current) {
            tracedObj.pointsArrRef.current = [];
          }
          if (tracedObj.pointsArrRef.current.length + 3 > traceLength * 3) {
            tracedObj.pointsArrRef.current.splice(0, 3);
          }
          tracedObj.pointsArrRef.current.push(objectPos.x, objectPos.y, objectPos.z);
        }
      });
    }
  }, traceInterval);

  return (
    <>
      {plotObjectsReady &&
        Object.keys(tracePlanets).map((key, index) =>
          tracePlanets[key] && tracedObjects.find((obj) => obj.name === key) ? (
            <TraceLine key={index} name={key} />
          ) : null
        )}
    </>
  );
}
