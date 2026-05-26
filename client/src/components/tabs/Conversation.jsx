import React, { useState, useEffect } from "react";
import "./AlgorithmVisualizer.css";

function Conversation() {
  const [showIntro, setShowIntro] = useState(true);
  const [phase, setPhase] = useState(1);
  const [selectedIframe, setSelectedIframe] = useState(null);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(2), 1000);
    const timer2 = setTimeout(() => setPhase(3), 2000);
    const timer3 = setTimeout(() => setShowIntro(false), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleOptionClick = (option) => {
    if (option === "screen-sharing") {
      window.open("https://video-calling-frontend-nu.vercel.app/", "_blank");
    } else {
      setSelectedIframe(option);
    }
  };

  return (
    <div className="visualizer-container">
      {showIntro && (
        <div className={`intro-overlay phase-${phase}`}>
          <div className="audio-visual-background">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="audio-bar" />
            ))}
          </div>

          <div className="content-wrapper">
            <div className="icon-container">
              <div className="video-icon">
                <div className="lens" />
                <div className="body" />
              </div>
              <div className="audio-wave-icon">
                <div className="wave" />
                <div className="wave" />
                <div className="wave" />
              </div>
            </div>

            <h1 className="title">Entering</h1>
            <div className="subtitle">Special-Rooms</div>

            <div className="loading-container">
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
              <div className="loading-text">Loading Experience...</div>
            </div>
          </div>
        </div>
      )}

      {!showIntro && !selectedIframe && (
        <div className="options-container">
          <h2 className="options-title">Choose an Option</h2>
          <div className="options-buttons">
            <button
              className="option-button animated-button"
              onClick={() => handleOptionClick("video-player")}
            >
              Audio-Rooms
            </button>
            <button
              className="option-button animated-button"
              onClick={() => handleOptionClick("screen-sharing")}
            >
              Screen-Sharing Rooms
            </button>
          </div>
        </div>
      )}

      {selectedIframe && (
        <iframe
          src="https://simple-audio-rooms.vercel.app"
          className="main-frame visible"
          title="Audio Rooms"
        />
      )}
    </div>
  );
}

export default Conversation;
