import { useEffect, useRef } from "react";

const useMousePosition = () => {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) => {
    // Normalize mouse position
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mouse;
};

export default useMousePosition;
