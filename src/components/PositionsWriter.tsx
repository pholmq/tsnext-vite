//test
import { createRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore, usePlotStore, useTraceStore } from "../store";
import { Vector3 } from "three";
import { useControls, folder } from "leva";

export default function PositionsWriter() {
  const trace = useStore((s) => s.trace);
  const posRef = useStore((s) => s.posRef);

  const plotObjects = usePlotStore((s) => s.plotObjects);
  const plotPosRef = useRef(0);
  const { traceLength, traceStepInput, tracedObjects } = useTraceStore();
  const traceStep = traceStepInput / 1000;

  // const {Mars} = useControls("Trace planets", {"Mars": false})
  const tracePlanets = useControls("Positions", {
    Moon: folder({ RA: 0 }),
  });

  useFrame(() => {});
  return <></>;
}
