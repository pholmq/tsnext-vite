import { Html } from "@react-three/drei";
import { useEffect } from "react";
import distanceFromHtmlElement from "../utils/distanceFromHtmlElement";

export function ContextMenu({ setContextMenu, setCameraTarget }) {
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
          Focus
        </button>
        <br />
        {/* <button
              onClick={() => {
                console.log("click");
                setContextMenu(false);
              }}
            >
              Trace&nbsp;on
            </button> */}
        <button
          className="m-1"
          onClick={() => {
            // console.log("click");
            setContextMenu(false);
          }}
        >
          Close&nbsp;menu
        </button>

        {/* <label id="posLabel">Close&nbsp;menu</label> */}
      </div>
    </Html>
  );
}
