import React, { useState } from "react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "absolute",
          top: "20px",
          right: isOpen ? "420px" : "20px",
          zIndex: 1100,
          backgroundColor: "#333",
          color: "rgba(255,255,255,0.75)",
          border: "none",
          padding: "8px",
          cursor: "pointer",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.75)";
          e.currentTarget.style.color = "black";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.75)";
          e.currentTarget.style.color = "rgba(50,50,50,50.70)";
        }}
      >
        {isOpen ? "Close" : "Open"} Book
      </button>

      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-420px",
          width: "420px",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.90)",
          transition: "right 0.5s ease",
          zIndex: 1000,
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "10px", color: "white" }}>
          <iframe
            src="https://book.tychos.space/chapters/1-a-brief-look/"
            title="External content"
            style={{ width: "100%", height: "100vh", border: "none" }}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
