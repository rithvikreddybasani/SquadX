import React, { useState, useEffect } from "react";

function ScreenShareTab() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false); // Hide intro after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
      {/* Introductory Screen */}
      {showIntro && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            animation: "curtain-close 3s forwards"
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              letterSpacing: "2px",
              textAlign: "center",
              textTransform: "uppercase",
              background: "linear-gradient(90deg, #ff8c00, #ff0080)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              animation: "fade-in 2s ease-in-out"
            }}
          >
            Clasp  
            <br />
            Build-In Version Control System
          </h1>
        </div>
      )}

      {/* Main Content */}
      <iframe
        src="https://claspp-rithvik.vercel.app/"
        width="100%"
        height="100%"
        style={{
          border: "none",
          position: "absolute",
          top: "0",
          left: "3",
          zIndex: 1,
          objectFit: "cover",
          opacity: showIntro ? 0 : 1,
          transition: "opacity 1s ease-in-out",
        }}
        title="audioConversation"
      ></iframe>
    </div>
  );
}

export default ScreenShareTab;
