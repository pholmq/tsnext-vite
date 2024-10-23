import { createRef } from "react";
import create from "zustand";
import { getDefaultSpeedFact, sDay } from "./utils/time-date-functions";
import miscSettings from "./settings/misc-settings.json";

// Main simulation store using zustand
export const useStore = create((set) => ({
  posRef: createRef(0),
  run: false,
  speedFact: getDefaultSpeedFact(),
  speedmultiplier: 1,
  showPositions: false,
  activeCamera: "orbit",
  cameraTarget: "Earth",
  cameraFollow: false,
  planetCamera: false,
  planetCameraHelper: false,
  planetCameraDirection: {
    camRotationy: 0,
    camRotationx: -0.2,
    camFov: 15,
    latRotationx: 0,
    longRotationy: 0,
  },

  trace: false,
  orbits: true,
  orbitsLinewidth: 1,
  arrows: false,
  arrowScale: 1,
  traceDots: false,
  menuRight: false,
  showStats: false,

  //Trigger update flags
  runPosWriter: false,
  resetClicked: false,

  // Setter functions
  setCameraTarget: (cameraTarget) => set(() => ({ cameraTarget })),
  setOrbits: (orbits) => set(() => ({ orbits })),
}));

export const usePosStore = create((set) => ({
  trackedObjects: [],
  positionRefs: [],
  addPositionRef: (positionRef) =>
    set((state) => {
      // Check if an item with the same id already exists
      const exists = state.positionRefs.some(
        (item) => item.name === positionRef.name
      );
      if (!exists) {
        // If it doesn't exist, add it to the array
        return { positionRefs: [...state.positionRefs, positionRef] };
      }
      // If it exists, update the ref
      return {
        positionRefs: state.positionRefs.map((item) =>
          item.name === positionRef.name ? positionRef : item
        ),
      };
    }),
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
