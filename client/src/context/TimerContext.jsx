import React, { createContext, useState, useEffect, useContext } from "react";

const TimerContext = createContext();

export const useTimer = () => {
  return useContext(TimerContext);
};

export const TimerProvider = ({ children }) => {
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
 con
  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval); // Clean up interval
  }, [isTimerActive]);

  // Start the timer
  useEffect(() => {
    setIsTimerActive(true);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <TimerContext.Provider value={{ timer, formatTime, setIsTimerActive }}>
      {children}
    </TimerContext.Provider>
  );
};
