import { useState, useEffect } from "react";

const phases = [
  { name: "Problem Understanding", duration: 3 },
  { name: "Backend & Database Setup", duration: 3 },
  { name: "Frontend UI Design", duration: 3 },
  { name: "Core Functionality Development", duration: 6 },
  { name: "Testing & Debugging", duration: 6 },
  { name: "PPT & Demo Preparation", duration: 3 },
  { name: "Final Fixes & Submission", duration: 2 },
];

export default function HackathonTimer() {
  const [mainTime, setMainTime] = useState(() => {
    const savedTime = localStorage.getItem("mainTime");
    return savedTime ? parseInt(savedTime) : 24 * 60 * 60;
  });
  const [phaseTimers, setPhaseTimers] = useState(
    phases.map((phase) => phase.duration * 60 * 60)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [runningTimers, setRunningTimers] = useState(Array(phases.length).fill(false));

  useEffect(() => {
    localStorage.setItem("mainTime", mainTime);
  }, [mainTime]);

  useEffect(() => {
    let mainInterval;
    let phaseIntervals = [];

    if (isRunning) {
      mainInterval = setInterval(() => {
        setMainTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    runningTimers.forEach((isRunning, index) => {
      if (isRunning) {
        phaseIntervals[index] = setInterval(() => {
          setPhaseTimers((prev) => {
            const newTimers = [...prev];
            newTimers[index] = Math.max(newTimers[index] - 1, 0);
            return newTimers;
          });
        }, 1000);
      }
    });

    return () => {
      if (mainInterval) clearInterval(mainInterval);
      phaseIntervals.forEach(clearInterval);
    };
  }, [isRunning, runningTimers]);

  const togglePhaseTimer = (index) => {
    setRunningTimers((prev) => {
      const newTimers = [...prev];
      newTimers[index] = !newTimers[index];
      return newTimers;
    });
  };

  const resetClock = () => {
    setMainTime(24 * 60 * 60);
    setPhaseTimers(phases.map(phase => phase.duration * 60 * 60));
    setIsRunning(false);
    setRunningTimers(Array(phases.length).fill(false));
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-green-900 via-teal-800 to-gray-900 text-lime-300">
      
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-4">Hackathon Timer
        <button className='absolute top-4 right-4 px-3 py-2 text-sm text-white bg-gray-600 hover:bg-gray-800 rounded-md' onClick={resetClock}>Reset</button>
      </h1>
      <div className="flex flex-wrap justify-center items-center w-full max-w-7xl gap-6">
        <div className="w-84 h-84 flex flex-col items-center justify-center text-5xl font-extrabold tracking-wider bg-transparent hover:animate-pulse rounded-full border-8 border-emerald-400 shadow-lg shadow-green-500/50 p-4">
          {mainTime === 0 ? 'Congratulations! You have completed all tasks 🎉' : formatTime(mainTime)}
          <button
            className="mt-2 px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-800"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-grow">
          {phases.map((phase, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-40 h-40 flex items-center justify-center rounded-full border-4 border-emerald-300  animate-border animate-border shadow-lg ${phaseTimers[index] === 0 ? 'text-transparent' : ''}`}>
                <p className="text-lg font-mono text-center">{phaseTimers[index] === 0 ? 'This task should be completed by now' : formatTime(phaseTimers[index])}</p>
              </div>
              <h2 className="text-lg font-semibold mt-2">{phase.name}</h2>
              <button
                className="mt-2 px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-700"
                onClick={() => togglePhaseTimer(index)}
              >
                {runningTimers[index] ? "Pause" : "Start"}
              </button>
            </div>
          ))} 
        </div>
      </div>
    </div>
  );
}
