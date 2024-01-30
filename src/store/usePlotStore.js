import { createRef } from "react";
import create from "zustand";

export const usePlotStore = create((set) => ({
  plotPos: 0,
  plotPosRef: createRef(0),
  plotObjects: [],
}));
