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
  toggleTrace: () => set((state) => ({ trace: !state.trace })),
  orbits: true,
  orbitsLinewidth: 2,
  arrows: false,
  arrowScale: 1,

  plotPos: 0,
  plotObjects: [],

  tracePos: 0,
  traceStep: 0.1,
  traceLength: 0,
  traceMaxLength: 1000,
  tracePositions: [],
}));
