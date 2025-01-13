import React, { useState, useEffect } from "react";
import "./ScreenShareTab.css";

function ScreenShareTab() {
  const [showIntro, setShowIntro] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(2), 1000);
    const timer2 = setTimeout(() => setAnimationPhase(3), 2000);
    const timer3 = setTimeout(() => setShowIntro(false), 4000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="screen-container">
      {showIntro && (
        <div className={`intro-screen phase-${animationPhase}`}>
          <div className="particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" />
            ))}
          </div>
          
          <div className="logo-container">
            <div className="logo-circle" />
            <h1 className="title">
              <span className="text-gradient">Clasp</span>
            </h1>
            <h2 className="subtitle">
              Build-In Version Control System
            </h2>
          </div>

          <div className="loading-bar">
            <div className="loading-progress" />
          </div>
        </div>
      )}

      <iframe
        src="https://claspp-rithvik.vercel.app/"
        className={`main-frame ${!showIntro ? 'visible' : ''}`}
        title="audioConversation"
      />
    </div>
  );
}

export default ScreenShareTab;
//https://simple-audio-rooms.vercel.app/