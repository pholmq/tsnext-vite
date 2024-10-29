import { Html } from "@react-three/drei";
import { useEffect } from "react";
import distanceFromHtmlElement from "../utils/distanceFromHtmlElement";
import { useStore } from "../store";
import { useControls } from "leva";
import { useLevaControls } from "./useLevaControls";
export function PlanetDescription({ planetName, setPlanetInfo }) {
  const handleMouseMove = (e) => {
    const element = document.getElementById("PlanetInfo");
    if (element) {
      const distance = distanceFromHtmlElement(element, e.clientX, e.clientY);
      // console.log(`Distance from element: ${distance}px`);
      if (distance > 100) {
        setPlanetInfo(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Html position={[0, 0, 0]}>
      <div
        id="PlanetInfo"
        className="m-1 text-white text-opacity-100 bg-gray-900 
        bg-opacity-50 rounded-md select-none"
      >
        <p className="text-sm">{planetName}</p>
      </div>
    </Html>
  );
}
