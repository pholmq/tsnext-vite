import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { getRaDecDistance } from "../utils/celestial-functions";
import { useThree } from "@react-three/fiber";
import { useStore } from "../store";

export function HoverMenu({
  hovered,
  contextMenu,
  planetInfo,
  name,
  symbol = "*",
}) {
  const labelRef = useRef(null);
  const intervalRef = useRef(null);
  const { scene, camera } = useThree();
  const run = useStore((s) => s.run);
  const planetCameraTarget = useStore((s) => s.planetCameraTarget);
  const planetCamera = useStore((s) => s.planetCamera);

  function update() {
    if (!labelRef.current) return;
    const { ra, dec, elongation, dist } = getRaDecDistance(name, scene);

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

  function hideMenu() {
    if (!hovered) return true;
    if (contextMenu) return true;
    if (planetInfo) return true;

    if (name === planetCameraTarget && planetCamera) return true;

    return false;
  }

  return (
    <Html position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
      <div
        hidden={hideMenu()}
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
