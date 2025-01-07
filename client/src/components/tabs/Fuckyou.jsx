import React, { useState, useEffect } from "react";
import "./AlgorithmVisualizer.css";

function Fuckyou() {
  const [showIntro, setShowIntro] = useState(true);
  const [phase, setPhase] = useState(1);

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

  return (
    <div className="visualizer-container">
      {showIntro && (
        <div className={`intro-overlay phase-${phase}`}>
          <div className="grid-background">
            {[...Array(100)].map((_, i) => (
              <div key={i} className="grid-cell" />
            ))}
          </div>
          
          <div className="binary-rain">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="binary-column">
                {[...Array(10)].map((_, j) => (
                  <span key={j} className="binary-digit">
                    {Math.round(Math.random())}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="content-wrapper">
            <div className="algo-symbol">
              <div className="algo-circle"></div>
              <div className="algo-lines">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="algo-line" />
                ))}
              </div>
            </div>
            
            <h1 className="title">Algorithm Visualizer</h1>
            <div className="subtitle">Visualize Data Structures & Algorithms</div>
            
            <div className="loading-container">
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
              <div className="loading-text">Initializing Visualizer...</div>
            </div>
          </div>
        </div>
      )}

      <iframe
        src="https://algorithm-visualizer.org"
        className={`main-frame ${!showIntro ? 'visible' : ''}`}
        title="Algorithm Visualizer"
      />
    </div>
  );
}

export default Fuckyou