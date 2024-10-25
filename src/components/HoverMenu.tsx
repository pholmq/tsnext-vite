import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { getRaDecDistance } from "../utils/celestial-functions";
import { useThree } from "@react-three/fiber";
import { useStore } from "../store";

export function HoverMenu({ hovered, name, symbol = "*" }) {
  const labelRef = useRef(null);
  const intervalRef = useRef(null);
  const { scene, camera } = useThree();
  const run = useStore((s) => s.run);

  function update() {
    if (!labelRef.current) return;
    const { ra, dec, elongation, dist, distAU, x, y, z } = getRaDecDistance(
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
      "<br/>Distance:&nbsp;" +
      dist +
      "<br/>Elongation:&nbsp;" +
      elongation +
      "\xB0";
  }

  useEffect(() => {
    if (run) {
      if (hovered) {
        intervalRef.current = setInterval(() => {
          update();
        }, 1000);
      } else {
        clearInterval(intervalRef.current);
      }
    }
    update();
  }, [run, hovered]);

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
