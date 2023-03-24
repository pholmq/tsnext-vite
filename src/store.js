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
  orbits: true,
  orbitsLinewidth: 1,
  arrows: false,
  arrowScale: 1,
}));
