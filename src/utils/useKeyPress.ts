import { useState, useEffect } from "react";

export default function useKeyPress(): string | null {
  const [keyPressed, setKeyPressed] = useState<string | null>(null);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      event.preventDefault();
      setKeyPressed(event.key);
    };

    const upHandler = () => {
      setKeyPressed(null);
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return keyPressed;
}
