import { createRef } from "react";
import create from "zustand";
import {
  getDefaultSpeedFact,
  posToDate,
  posToTime,
} from "./utils/time-date-functions";

export const useStore = create((set) => ({
  posRef: createRef(),
  date: posToDate(0),
  time: posToTime(0),
  run: false,
  speedFact: getDefaultSpeedFact(),
  trace: false,
  toggleTrace: () => {
    set((state) => ({ trace: !state.trace }));
    set((state) => (state.trace ? { traceInit: true } : null));
    // state.trace ? set((state) => ({ traceInit: true })): null
  },
  orbits: true,
  orbitsLinewidth: 2,
  arrows: false,
  arrowScale: 1,
}));

export const usePlotStore = create((set) => ({
  plotPos: 0,
  plotPosRef: createRef(0),
  plotObjects: [],
}));

export const useTraceStore = create((set) => ({
  traceLength: 1000,
  traceStepInput: 5,
  traceLinewidth: 2,
  pointsArrRef: createRef(),
}));
