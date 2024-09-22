import React, { useState } from "react";

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle button for opening/closing the sidebar */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          top: "20px",
          right: isOpen ? "420px" : "20px", // Adjust button position
          zIndex: 1100,
          backgroundColor: "#333",
          color: "white",
          border: "none",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        {isOpen ? "Close" : "Open"} Sidebar
      </button>

      {/* Sidebar container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-400px", // Slide in/out animation
          width: "400px",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          transition: "right 0.5s ease", // Smooth transition for sliding
          zIndex: 1000,
          overflowY: "auto", // To scroll through long content
        }}
      >
        {/* Sidebar content */}
        <div style={{ padding: "20px", color: "white" }}>{children}</div>
      </div>
    </>
  );
};

export default Sidebar;
