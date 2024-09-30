import React from "react";
import { useProgress } from "@react-three/drei";

const LoadingBar = () => {
  const { progress } = useProgress(); // Get the progress from the useProgress hook

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "5px", backgroundColor: "#333" }}>
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "lime",
          transition: "width 0.3s ease",
        }}
      />
      <div style={{ color: "white", position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)" }}>
        Loading {Math.floor(progress)}%
      </div>
    </div>
  );
};

export default LoadingBar;
