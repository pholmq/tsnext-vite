import { Html } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { getRaDecDistance } from "../utils/celestial-functions";
import { useThree } from "@react-three/fiber";
import { useStore, usePosStore } from "../store";

import { useControls } from "leva";
import miscSettings from "../settings/misc-settings.json";
import { useLevaControls } from "./useLevaControls";

export function PosWriter({ hovered, name, symbol = "*" }) {
  const labelRef = useRef(null);
  const hoveredIntervalRef = useRef(null);
  const trackedIntervalRef = useRef(null);
  const { scene, camera } = useThree();
  const run = useStore((s) => s.run);
  const trackedPlanets = usePosStore((s) => s.trackedObjects);
  const addPositionRef = usePosStore((s) => s.addPositionRef);
  const positionRef = useRef(null);

  const runPosWriter = useStore((s) => s.runPosWriter);
  // const [tracked, setTracked] = useState(false);
  const tracked = trackedPlanets.includes(name);
  function updatePos() {
    //We use a ref thats added to the store to update the position because of performance
    positionRef.current = getRaDecDistance(name, scene, camera);
  }

  function updateLabel() {
    if (!labelRef.current) return;
    const { ra, dec, elongation, distKm, distAU, x, y, z } = getRaDecDistance(
      name,
      scene,
      camera
    );

    labelRef.current.innerHTML =
      name +
      " " +
      symbol +
      "<br>" +
      // description +
      "(Right&nbspclick&nbspfor&nbspmenu)" +
      "<br>" +
      "RA:&nbsp;" +
      ra +
      "<br/>Dec:&nbsp;" +
      dec +
      "<br/>Km:&nbsp;" +
      distKm +
      "<br/>AU:&nbsp;" +
      distAU +
      "<br/>Elongation:&nbsp;" +
      elongation +
      "\xB0";
  }

  useEffect(() => {
    if (tracked) {
      addPositionRef({ name: name, ref: positionRef });
      updatePos();
    }
    // console.log(usePosStore.getState().positionRefs);
  }, [trackedPlanets]);

  useEffect(() => {
    if (run) {
      if (hovered) {
        hoveredIntervalRef.current = setInterval(() => {
          updateLabel();
        }, 1000);
      } else {
        clearInterval(hoveredIntervalRef.current);
      }
      if (tracked) {
        trackedIntervalRef.current = setInterval(() => {
          updatePos();
        }, 1000);
      }
    } else {
      clearInterval(trackedIntervalRef.current);
    }
    updateLabel();
    if (tracked) {
      updatePos();
    }
  }, [run, hovered, runPosWriter]);

  return (
    <Html position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
      <div
        hidden={hovered ? false : true}
        className="p-1 text-white text-opacity-100 bg-gray-900 
        bg-opacity-50 rounded-md select-none"
      >
        <label id="posLabel" ref={labelRef}>
          RA:&nbsp;XXhXXmXXs Dec:&nbsp;+XX°XX&apos;XX&quot;
        </label>
      </div>
    </Html>
  );
}
