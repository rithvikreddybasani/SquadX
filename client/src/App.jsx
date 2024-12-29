import { Route, BrowserRouter, Routes } from "react-router-dom";
import Toast from "./components/toast/Toast";
import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import PageNot from "./pages/PageNot";
import { useState, useEffect } from "react";

// Format time to mm:ss
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

function App() {
  const [timer, setTimer] = useState(0); // Timer state to track session time
  const [isTimerActive, setIsTimerActive] = useState(false); // Control timer activation

  // Start the timer when the component mounts (session starts)
  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1); // Increment timer every second
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval when the component unmounts or timer stops
  }, [isTimerActive]);

  // Start the timer when the component mounts
  useEffect(() => {
    setIsTimerActive(true);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
          <Route path="*" element={<PageNot />} />
        </Routes>
      </BrowserRouter>
      <Toast /> {/* Toast component from react-hot-toast */}

      {/* Timer Display - Fixed to bottom-right */}
      <p
        style={{
          position: "fixed",
          bottom: "10px", // Keeps the timer fixed at the bottom with a small margin
          right: "10px",  // Keeps the timer fixed to the right
          backgroundColor: "#000", // Set the background color for visibility
          color: "#fff", // Set the text color
          padding: "10px", // Adds some padding for better appearance
          borderRadius: "5px", // Optional: adds rounded corners to the timer box
          fontSize: "14px", // You can adjust this value to change font size
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional: adds shadow for better visibility
        }}
      >
        Session Time: {formatTime(timer)} {/* Display formatted session time */}
      </p>
    </>
  );
}

export default App;
