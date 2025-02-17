import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { TrophyIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Achievement = ({ title, description, icon: Icon, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm"
  >
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  </motion.div>
);

const Achievements = () => {
  const [currentAchievement, setCurrentAchievement] = useState(null);

  const triggerAchievement = (achievement) => {
    setCurrentAchievement(achievement);
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.9, x: 0.9 }
    });

    // Clear achievement after 5 seconds
    setTimeout(() => {
      setCurrentAchievement(null);
    }, 5000);
  };

  return (
    <AnimatePresence>
      {currentAchievement && (
        <Achievement
          {...currentAchievement}
          onClose={() => setCurrentAchievement(null)}
        />
      )}
    </AnimatePresence>
  );
};

export default Achievements; 