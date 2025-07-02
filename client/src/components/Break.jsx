import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee, ChevronDown, X } from 'lucide-react';

export default function SidebarBreakTimer() {
  const [duration, setDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(5 * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Timer finished notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break time is over!', {
          body: 'Time to get back to work.',
          icon: '☕'
        });
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    setTimeLeft(newDuration * 60);
    setIsRunning(false);
    setIsConfiguring(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsConfiguring(false);
    }
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const getStatusColor = () => {
    if (timeLeft === 0) return 'text-green-600';
    if (isRunning) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStatusDot = () => {
    if (timeLeft === 0) return 'bg-green-500';
    if (isRunning) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div className="w-full font-sans">
      {/* Sidebar Button */}
      <div
        onClick={toggleExpanded}
        className="w-full p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Coffee className={`w-6 h-6 ${getStatusColor()}`} />
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusDot()}`}></div>
            </div>
            <div>
              <div className="font-medium text-gray-900 text-base">Break Timer</div>
              <div className="text-sm text-gray-500">
                {isRunning ? `${formatTime(timeLeft)} left` : `${duration}m ready`}
              </div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`} />
        </div>
      </div>

      {/* Expanded Timer Panel */}
      {isExpanded && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coffee className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Break Timer</h3>
              </div>
              <button
                onClick={toggleExpanded}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Configuration Panel */}
            {isConfiguring && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Set Duration</h4>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[1, 2, 3, 5, 10, 15, 20, 25, 30].map((min) => (
                    <button
                      key={min}
                      onClick={() => handleDurationChange(min)}
                      className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                        duration === min
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-300'
                      }`}
                    >
                      {min}m
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsConfiguring(false)}
                  className="w-full py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {/* Timer Display */}
            <div className="text-center mb-6">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              {/* Time Display */}
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {duration} minute break
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-3 mb-4">
              <button
                onClick={handleStart}
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition-all duration-200 ${
                  isRunning
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 hover:bg-gray-600 text-white shadow-md transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsConfiguring(!isConfiguring)}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Status */}
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                timeLeft === 0
                  ? 'bg-green-100 text-green-800'
                  : isRunning
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {timeLeft === 0 ? '✨ Break Complete!' : isRunning ? '⏰ Timer Active' : '⏸️ Timer Paused'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}