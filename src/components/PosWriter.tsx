import { Html } from "@react-three/drei";
import { useControls } from "leva";
import { useRef } from "react";
import { getRaDecDistance } from "../utils/celestial-functions";
import { useThree } from "@react-three/fiber";
import { useStore } from "../store";

export function PosWriter({ hovered, name, symbol = "*" }) {
  const labelRef = useRef(null);
  const intervalRef = useRef(null);
  const { scene, camera } = useThree();
  const run = useStore((s) => s.run);
  const runPosWriter = useStore((s) => s.runPosWriter);

  function updateLabel() {
    if (!labelRef.current) return;

    const { ra, dec, elongation, distKm, distAU } = getRaDecDistance(
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
      "\xB0";
  }
  const { [name]: on } = useControls("Positions", {
    [name]: {
      value: false,
    },
  });

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

  return (
    <Html position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
      <div
        hidden={hovered || on ? false : true}
        className="text-white text-opacity-100 bg-gray-900 
        bg-opacity-50 rounded-md select-none"
      >
        <label ref={labelRef}>
          RA:&nbsp;XXhXXmXXs Dec:&nbsp;+XX°XX&apos;XX&quot;
        </label>
      </div>
    </Html>
  );
}
