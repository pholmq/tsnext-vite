import { useEffect, useState } from "react";

const useMouseButton = () => {
  const [pressedButton, setPressedButton] = useState<number | null>(null);

  const handlePointerDown = (event: PointerEvent) => {
    setPressedButton(event.button); // Set the pressifed button code
  };

  const handlePointerUp = (event: PointerEvent) => {
    setPressedButton(null); // Reset when any button is released
  };

  useEffect(() => {
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return pressedButton; // Return the pressed button code or null
};

export default useMouseButton;
