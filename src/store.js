import { createRef } from "react";
import create from "zustand";
import { getDefaultSpeedFact, sDay } from "./utils/time-date-functions";

// Main simulation store using zustand
export const useStore = create((set) => ({
  posRef: createRef(0),
  run: false,
  speedFact: getDefaultSpeedFact(),
  speedmultiplier: 1,
  activeCamera: "orbit",
  cameraTarget: "Earth",
  cameraFollow: false,
  planetCamera: false,
  planetCameraHelper: false,
  trace: false,
  orbits: true,
  orbitsLinewidth: 1,
  arrows: false,
  arrowScale: 1,
  traceDots: false,
  menuRight: false,
  showStats: false,
  runPosWriter: false,

  // Setter functions
  setCameraTarget: (cameraTarget) => set(() => ({ cameraTarget })),
  setOrbits: (orbits) => set(() => ({ orbits })),
}));

// Plot-related store using zustand
export const usePlotStore = create((set) => ({
  plotPos: 0,
  plotPosRef: createRef(0),
  plotObjects: [],
}));

// Trace-related store using zustand
export const useTraceStore = create((set) => ({
  traceLength: 5000,
  traceStepInput: 4,
  stepFact: sDay,
  stepMultiplier: 1,
  traceInterval: 10,
  traceLinewidth: 2,
  traceStartPosRef: createRef(0),
  tracedObjects: [],

  // Setter functions for trace-specific values
  setTraceLength: (traceLength) => set(() => ({ traceLength })),
  setTraceLinewidth: (traceLinewidth) => set(() => ({ traceLinewidth })),
}));
