import { useState, useEffect, useCallback } from "react";

interface ScrollState {
  isScrolling: boolean;
  direction: "up" | "down" | "left" | "right" | null;
  delta: { x: number; y: number };
}

const useScrollWheel = () => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrolling: false,
    direction: null,
    delta: { x: 0, y: 0 },
  });

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();

      const { deltaX, deltaY } = event;
      let direction: "up" | "down" | "left" | "right" | null = null;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? "right" : "left";
      } else {
        direction = deltaY > 0 ? "down" : "up";
      }

      setScrollState({
        isScrolling: true,
        direction,
        delta: { x: deltaX, y: deltaY },
      });

      if (timeoutId) clearTimeout(timeoutId);

      const newTimeoutId = setTimeout(() => {
        setScrollState((prev) => ({ ...prev, isScrolling: false }));
      }, 150);

      setTimeoutId(newTimeoutId);
    },
    [timeoutId]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [handleScroll]);

  return scrollState;
};

export default useScrollWheel;
