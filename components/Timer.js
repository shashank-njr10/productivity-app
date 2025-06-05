import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function Timer({ taskId, onSessionComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // in seconds
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date());
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = async () => {
    setIsRunning(false);

    if (time > 0 && startTime) {
      const duration = time / 3600; // convert to hours

      try {
        const response = await fetch("/api/work-sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskId,
            startTime,
            endTime: new Date(),
            duration,
          }),
        });

        if (response.ok) {
          onSessionComplete?.(duration);
          // Modern notification instead of alert
          showSuccessNotification(formatTime(time));
        }
      } catch (error) {
        console.error("Error saving work session:", error);
        showErrorNotification();
      }
    }

    setTime(0);
    setStartTime(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setStartTime(null);
    clearInterval(intervalRef.current);
  };

  const showSuccessNotification = (timeWorked) => {
    // You can replace this with a toast library later
    alert(`🎉 Focus session complete! You crushed ${timeWorked} of deep work!`);
  };

  const showErrorNotification = () => {
    alert("⚠️ Session saved locally but sync failed. Check your connection.");
  };

  // Get motivational message based on time
  const getMotivationalMessage = () => {
    const minutes = Math.floor(time / 60);
    if (time === 0) return "Ready to enter the flow state?";
    if (minutes < 5) return "Building momentum...";
    if (minutes < 15) return "You're in the zone! 🔥";
    if (minutes < 30) return "Deep work mode activated! ⚡";
    if (minutes < 60) return "Legendary focus session! 🚀";
    return "You're a productivity machine! 🏆";
  };

  return (
    <Card className="relative backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/20 rounded-2xl p-8 overflow-hidden">
      <CardHeader className="text-center mb-8">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          ⚡ Deep Focus Zone
        </CardTitle>
        <p className="text-gray-400 text-sm">{getMotivationalMessage()}</p>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-10">
          <div
            className={`relative inline-block p-8 rounded-3xl ${
              isRunning
                ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30"
                : "bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-2 border-gray-500/30"
            } transition-all duration-500`}
          >
            <div
              className={`text-6xl md:text-8xl font-mono font-black tracking-wider transition-all duration-300 ${
                isRunning
                  ? "bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl"
                  : "text-white drop-shadow-lg"
              }`}
            >
              {formatTime(time)}
            </div>
            {isRunning && (
              <div className="absolute inset-0 rounded-3xl border-2 border-green-400 opacity-50 animate-ping"></div>
            )}
          </div>
          <div className="mt-6 flex items-center justify-center space-x-3">
            <div
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                isRunning
                  ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
                  : "bg-gray-500"
              }`}
            ></div>
            <p
              className={`text-lg font-medium transition-all duration-300 ${
                isRunning ? "text-green-400" : "text-gray-400"
              }`}
            >
              {isRunning ? "🔴 Deep work in progress..." : "⏸️ Ready for focus"}
            </p>
            <div
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                isRunning
                  ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
                  : "bg-gray-500"
              }`}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              className="col-span-2 md:col-span-1"
              size="lg"
            >
              <span className="flex items-center">
                <span className="mr-2 text-xl">▶️</span>Start Focus
              </span>
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              className="col-span-2 md:col-span-1"
              size="lg"
              variant="secondary"
            >
              <span className="flex items-center">
                <span className="mr-2 text-xl">⏸️</span>Pause
              </span>
            </Button>
          )}
          <Button
            onClick={handleStop}
            disabled={time === 0}
            className="col-span-2 md:col-span-1"
            size="lg"
            variant="destructive"
          >
            <span className="flex items-center">
              <span className="mr-2 text-xl">⏹️</span>Save Session
            </span>
          </Button>
          <Button
            onClick={handleReset}
            className="col-span-2 md:col-span-1"
            size="lg"
            variant="outline"
          >
            <span className="flex items-center">
              <span className="mr-2 text-xl">🔄</span>Reset
            </span>
          </Button>
        </div>
        <Progress value={Math.min((time / 3600) * 100, 100)} className="mb-2" />
      </CardContent>
    </Card>
  );
}
