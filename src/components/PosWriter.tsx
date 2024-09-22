import { Html } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { getRaDecDistance } from "../utils/celestial-functions";
import { useThree } from "@react-three/fiber";
import { useStore } from "../store";
import { posToDate, posToTime } from "../utils/time-date-functions";

export function PosWriter({ hovered, name, symbol = "*" }) {
  const labelRef = useRef(null);
  const intervalRef = useRef(null);
  const { scene, camera } = useThree();
  const run = useStore((s) => s.run);
  const posRef = useStore((s) => s.posRef);
  const runPosWriter = useStore((s) => s.runPosWriter);
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
      "<br/>" +
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
      // "<br/>X:&nbsp;" +
      // x +
      // "<br/>Y:&nbsp;" +
      // y +
      // "<br/>Z:&nbsp;" +
      // z +
      "\xB0";
  }
  const { [name]: on } = useControls("Positions", {
    [name]: {
      value: false,
    },
  });

  useEffect(() => {
    updateLabel();
  }, [runPosWriter]);

  clearInterval(intervalRef.current);
  updateLabel();

  if (run) {
    if (hovered || on) {
      intervalRef.current = setInterval(() => {
        updateLabel();
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
  }

  // if (contextMenu) {
  //   let text = labelRef.current.innerText;
  //   text += "\n" + "Date: " + posToDate(posRef.current);
  //   text += "\n" + "Time: " + posToTime(posRef.current);
  //   navigator.clipboard.writeText(text);
  // }

  return (
    <Html position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
      <div
        hidden={hovered || on ? false : true}
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

