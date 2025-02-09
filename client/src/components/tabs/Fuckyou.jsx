import React, { useState, useEffect } from "react";
import "./AlgorithmVisualizer.css";

function AlgorithmVisualizer() {
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
    setSelectedIframe(option);
  };

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

            <h1 className="title">Visualizer</h1>
            <div className="subtitle">Visualize Data Structures & Algorithms and React</div>

            <div className="loading-container">
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
              <div className="loading-text">Initializing Visualizer...</div>
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
              onClick={() => handleOptionClick("react-playground")}
            >
              React Playground
            </button>
            <button
              className="option-button animated-button"
              onClick={() => handleOptionClick("dsa-visualizer")}
            >
              DSA Visualizer
            </button>
            <button
              className="option-button animated-button"
              onClick={() => handleOptionClick("htmlcss")}
            >
              HTML-CSS-JS
            </button>
          </div>
        </div>
      )}

      {selectedIframe && (
        <iframe
          src={
            selectedIframe === "react-playground"
              ? "https://reactplayground.vercel.app"
              : selectedIframe==="htmlcss"?"https://htmlcssjssyn.vercel.app":"https://algorithm-visualizer.org"
          }
          className="main-frame visible"
          title={selectedIframe === "react-playground" ? "React Playground" :selectedIframe==="dsa-visualizer"?"Data Visulizer": "HTML-CSS-JS"}
        />
      )}
    </div>
  );
}

export default AlgorithmVisualizer;
