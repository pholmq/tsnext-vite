import { Html } from "@react-three/drei";
import { useEffect } from "react";
import distanceFromHtmlElement from "../utils/distanceFromHtmlElement";
import { useStore } from "../store";
import { useControls } from "leva";
import { useLevaControls } from "./useLevaControls";
export function ContextMenu({
  contextMenu,
  setContextMenu,
  setPlanetInfo,
  planetName,
}) {
  // const [showH, setHelper] = useControls("Planet Camera", () => ({
  //   showHelper: true,
  // }));
  const { updateControls } = useLevaControls();
  const planetCameraTarget = useStore((s) => s.planetCameraTarget);
  const planetCamera = useStore((s) => s.planetCamera);

  const handleMouseMove = (e) => {
    const element = document.getElementById("ContextMenu");
    if (element) {
      const distance = distanceFromHtmlElement(element, e.clientX, e.clientY);
      // console.log(`Distance from element: ${distance}px`);
      if (distance > 100) {
        setContextMenu(false);
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

  function hideMenu() {
    if (!contextMenu) return true;
    if (name === planetCameraTarget && planetCamera) return true;

    return false;
  }

  return (
    <Html position={[0, 0, 0]}>
      <div
        hidden={hideMenu()}
        id="ContextMenu"
        // hidden={hovered || on ? false : true}
        className="m-1 text-white text-opacity-100 bg-gray-900 
        bg-opacity-50 rounded-md select-none"
      >
        <button
          className="m-1 hover:bg-sky-700"
          id="Focus"
          onClick={(e) => {
            updateControls({ Target: planetName });
            setContextMenu(false);
          }}
        >
          Camera_focus
        </button>
        <br />
        <button
          className="m-1 hover:bg-sky-700"
          id="Follow"
          onClick={(e) => {
            updateControls({ Target: planetName });
            updateControls({ Follow: true });
            setContextMenu(false);
          }}
        >
          Camera_follow
        </button>
        <button
          className="m-1 hover:bg-sky-700"
          id="Planet_Info"
          onClick={(e) => {
            setContextMenu(false);
            setPlanetInfo(true);
          }}
        >
          Planet_Info
        </button>
        <br />
      </div>
    </Html>
  );
}
