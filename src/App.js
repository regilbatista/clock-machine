import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  const [beep, setBeep] = useState(false);

  // Para mostrar el tiempo en formato mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Lógica de decremento e incremento de los tiempos de sesión y descanso
  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  // Lógica de start/stop
  const handleStartStop = () => {
    if (isActive) {
      clearInterval(intervalId);
    } else {
      const id = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            clearInterval(id);
            if (isSession) {
              setIsSession(false); // Cambiar a descanso
              setTimeLeft(breakLength * 60);
            } else {
              setIsSession(true); // Cambiar a sesión
              setTimeLeft(sessionLength * 60);
            }
          }
          return prevTime - 1;
        });
      }, 1000);
      setIntervalId(id);
    }
    setIsActive(!isActive);
  };

  // Lógica de reset
  const handleReset = () => {
    clearInterval(intervalId);
    setIsActive(false);
    setIsSession(true);
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft(25 * 60);
    setBeep(false);
  };

  // Lógica del sonido de "beep" cuando el tiempo llega a 0
  useEffect(() => {
    if (timeLeft === 0) {
      setBeep(true);
      const audio = document.getElementById("beep");
      audio.play();
      audio.onended = () => setBeep(false);
    }
  }, [timeLeft]);

  return (
    <div className="app">
      <div className="container text-center">
        <div id="pomodoro">
          <div className="row">
            <div className="col-12">
              <label id="session-label">Session Length</label>
              <button id="session-decrement" onClick={handleSessionDecrement}>
                -
              </button>
              <span id="session-length">{sessionLength}</span>
              <button id="session-increment" onClick={handleSessionIncrement}>
                +
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <label id="break-label">Break Length</label>
              <button id="break-decrement" onClick={handleBreakDecrement}>
                -
              </button>
              <span id="break-length">{breakLength}</span>
              <button id="break-increment" onClick={handleBreakIncrement}>
                +
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <label id="timer-label">{isSession ? "Session" : "Break"}</label>
              <div id="time-left">{formatTime(timeLeft)}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button id="start_stop" onClick={handleStartStop}>
                {isActive ? "Pause" : "Start"}
              </button>
              <button id="reset" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
          <audio id="beep" src="https://www.soundjay.com/button/beep-07.wav" />
        </div>
      </div>
      <footer className="footer">
        &copy; {new Date().getFullYear()} - by Regil Batista Todos los derechos
        reservados
      </footer>
    </div>
  );
}

export default App;
