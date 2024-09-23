import { createRef } from "react";
import create from "zustand";
import {
  getDefaultSpeedFact,
  sDay,
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
  planetCamera: false,
  trace: false,
  orbits: true,
  orbitsLinewidth: 1,
  arrows: false,
  arrowScale: 1,
  traceDots: false,
  runPosWriter: false, //We flip this in controls to get PosWriter to update
  // posWriterRef: createRef({}), //a ref obj that holds the PosWriters data
  // posWriterPlanets: {},
}));

export const usePlotStore = create((set) => ({
  plotPos: 0,
  plotPosRef: createRef(0),
  plotObjects: [],
}));

export const useTraceStore = create((set) => ({
  traceLength: 5000,
  traceStepInput: 4,
  stepFact: sDay,
  stepMultiplier: 1,
  traceInterval: 10,
  traceLinewidth: 2,
  traceStartPosRef: createRef(0),
  tracedObjects: [],
  // pointsArrRef: createRef(),
}));
