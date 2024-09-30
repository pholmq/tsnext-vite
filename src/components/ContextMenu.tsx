import { Html } from "@react-three/drei";
import { useEffect } from "react";
import distanceFromHtmlElement from "../utils/distanceFromHtmlElement";
import { useStore } from "../store";
import { useControls } from "leva";
export function ContextMenu({ setContextMenu, setCameraTarget }) {
  // const [showH, setHelper] = useControls("Planet Camera", () => ({
  //   showHelper: true,
  // }));
  const [{ Follow }, setFollow] = useControls("Camera", () => ({
    Follow: false,
  }));
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

  return (
    <Html position={[0, 0, 0]}>
      <div
        id="ContextMenu"
        // hidden={hovered || on ? false : true}
        className="m-1 text-white text-opacity-100 bg-gray-900 
        bg-opacity-50 rounded-md select-none"
      >
        <button
          className="m-1 hover:bg-sky-700"
          id="Focus"
          onClick={(e) => {
            setCameraTarget(true);
            setContextMenu(false);
          }}
        >
          Camera_focus
        </button>
        <br />
        <button
          className="m-1 hover:bg-sky-700"
          id="Focus"
          onClick={(e) => {
            setCameraTarget(true);
            setFollow({ Follow: true });
            setContextMenu(false);
          }}
        >
          Camera_follow
        </button>
        <br />
      </div>
    </Html>
  );
}
