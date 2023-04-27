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
  orbits: true,
  orbitsLinewidth: 2,
  arrows: false,
  arrowScale: 1,

  plotPos: 0,
  plotObjects: [],
}));
