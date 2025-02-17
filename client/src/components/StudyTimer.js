import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClockIcon, PlayIcon, PauseIcon, XMarkIcon } from '@heroicons/react/24/outline';

const StudyTimer = () => {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      // Play notification sound when timer ends
      new Audio('/sounds/timer-end.mp3').play();
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const enterFocusMode = () => {
    setShowFocusMode(true);
    document.documentElement.classList.add('focus-mode');
  };

  const exitFocusMode = () => {
    setShowFocusMode(false);
    document.documentElement.classList.remove('focus-mode');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
      >
        <div className="flex items-center space-x-4">
          <ClockIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          <span className="text-2xl font-mono text-gray-900 dark:text-white">
            {formatTime(time)}
          </span>
          <button
            onClick={toggleTimer}
            className="p-2 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800"
          >
            {isRunning ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={enterFocusMode}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
          >
            Focus Mode
          </button>
        </div>
      </motion.div>

      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {showFocusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          >
            <div className="text-center text-white">
              <div className="text-6xl font-mono mb-8">{formatTime(time)}</div>
              <div className="space-x-4">
                <button
                  onClick={toggleTimer}
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={exitFocusMode}
                  className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Exit Focus Mode
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudyTimer; 