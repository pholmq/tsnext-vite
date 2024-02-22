import { createRef } from "react";
import create from "zustand";
import {
  getDefaultSpeedFact,
  posToDate,
  posToTime,
} from "./utils/time-date-functions";

export const useStore = create((set) => ({
  posRef: createRef(0),
  run: false,
  speedFact: getDefaultSpeedFact(),
  speedmultiplier: 1,
  activeCamera: "orbit",
  cameraTarget: "Earth",
  cameraFollow: false,
  trace: false,
  orbits: true,
  orbitsLinewidth: 2,
  arrows: false,
  arrowScale: 1,
  traceDots: false,
  runPosWriter: false, //Ugly hack. We flip this in controls to get WritePositions to update
}));

export const usePlotStore = create((set) => ({
  plotPos: 0,
  plotPosRef: createRef(0),
  plotObjects: [],
}));

export const useTraceStore = create((set) => ({
  traceLength: 5000,
  traceStepInput: 4,
  traceInterval: 10,
  traceLinewidth: 2,
  traceStartPosRef: createRef(0),
  tracedObjects: [],
  // pointsArrRef: createRef(),
}));
