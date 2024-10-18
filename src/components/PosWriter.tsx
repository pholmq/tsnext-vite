import { Html } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { getRaDecDistance } from "../utils/celestial-functions";
import { useThree } from "@react-three/fiber";
import { useStore } from "../store";
import { posToDate, posToTime } from "../utils/time-date-functions";
import { useLevaControls } from "./useLevaControls";

export function PosWriter({ hovered, name, symbol = "*", tracked }) {
  const labelRef = useRef(null);
  const intervalRef = useRef(null);
  const { scene, camera } = useThree();
  const run = useStore((s) => s.run);
  const posRef = useStore((s) => s.posRef);
  const runPosWriter = useStore((s) => s.runPosWriter);
  const { values, updateControls } = useLevaControls();

  function updateLabel() {
    if (!labelRef.current) return;

    const { ra, dec, elongation, distKm, distAU, x, y, z } = getRaDecDistance(
      name,
      scene,
      camera
    );

    /* This could be stored in a file and be shown in a different place in the app */
    const celestialDescriptionsOfTheory = {
      Earth: "https://book.tychos.space/chapters/11-earths-pvp-orbit",
      Moon: "The central 'driveshaft'",
      Sun: "is rather hot!",
      Halleys: "",
      Jupiter: "is the largest planet.",
      Saturn: "",
      Uranus: "",
      Neptune: "",
      Venus: "",
      Mercury: "",
      Mars: "was a mystery",
      Phobos: "",
      Deimos: "",
      Eros: "",
    };

    const description =
      celestialDescriptionsOfTheory[name] || "Description not available";

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
  // const { [name]: on } = useControls("Positions", {
  //   [name]: {
  //     value: false,
  //   },
  // });

  // useEffect(() => {
  //   updateLabel();
  //   const { ra, dec, elongation, distKm, distAU, x, y, z } = getRaDecDistance(
  //     name,
  //     scene,
  //     camera
  //   );
  //   // console.log(values, `${name}_RA`);
  //   if (tracked) {
  //     updateControls({ [`${name}_RA`]: ra });
  //   }
  //   console.log("useffect");
  // }, [runPosWriter]);

  clearInterval(intervalRef.current);
  updateLabel();
  // if (tracked && name && name && camera) {
  //   console.log(name, scene, camera);
  //   const { ra, dec, elongation, distKm, distAU, x, y, z } = getRaDecDistance(
  //     name,
  //     scene,
  //     camera
  //   );
  //   updateControls({ [`${name}_RA`]: 6 });
  // }

  if (run) {
    if (hovered) {
      intervalRef.current = setInterval(() => {
        updateLabel();
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    if (tracked) {
      intervalRef.current = setInterval(() => {
        const { ra, dec, elongation, distKm, distAU, x, y, z } =
          getRaDecDistance(name, scene, camera);
        updateControls({ [`${name}_RA`]: ra });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
  }

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
