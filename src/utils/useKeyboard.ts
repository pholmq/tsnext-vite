import { useEffect, useRef } from "react";

export default function useKeyboard() {
  const keyMap = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keyMap.current[event.code] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keyMap.current[event.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keyMap.current;
}
