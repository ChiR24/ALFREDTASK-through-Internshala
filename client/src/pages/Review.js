import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

const Review = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState(0);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showFeedback, setShowFeedback] = useState({ show: false, correct: false });
  const navigate = useNavigate();
  const correctSound = useRef(new Audio('/sounds/correct.mp3'));
  const incorrectSound = useRef(new Audio('/sounds/incorrect.mp3'));
  const flipSound = useRef(new Audio('/sounds/flip.mp3'));

  // Keyboard shortcuts handler
  const handleKeyPress = useCallback((event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      setIsFlipped(prev => !prev);
    } else if (isFlipped) {
      if (event.key === 'ArrowRight' || event.key === 'j') {
        handleAnswer(true);
      } else if (event.key === 'ArrowLeft' || event.key === 'f') {
        handleAnswer(false);
      }
    }
  }, [isFlipped]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    fetchDueFlashcards();
  }, []);

  const fetchDueFlashcards = async () => {
    try {
      const response = await axios.get('/api/flashcards/due');
      setFlashcards(response.data);
    } catch (err) {
      setError('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (isCorrect) => {
    try {
      // Play sound effect
      if (isCorrect) {
        correctSound.current.play();
      } else {
        incorrectSound.current.play();
      }
      
      const currentCard = flashcards[currentIndex];
      await axios.patch(`/api/flashcards/${currentCard._id}/review`, {
        isCorrect,
      });

      // Show feedback animation
      setShowFeedback({ show: true, correct: isCorrect });
      setDirection(isCorrect ? 1 : -1);
      
      // Move to next card with animation
      setTimeout(() => {
        setShowFeedback({ show: false, correct: isCorrect });
        if (currentIndex < flashcards.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setDirection(0);
        } else {
          navigate('/');
        }
        setIsFlipped(false);
      }, 800);
    } catch (err) {
      setError('Failed to update flashcard');
    }
  };

  const handleFlip = () => {
    flipSound.current.play();
    setIsFlipped(!isFlipped);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No cards due for review!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Great job! You've completed all your reviews for now.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with keyboard shortcuts button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Review Flashcards
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowKeyboardShortcuts(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <KeyIcon className="w-5 h-5" />
          <span>Shortcuts</span>
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{`${currentIndex + 1} / ${flashcards.length}`}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentIndex + 1) / flashcards.length) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000 relative h-[400px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentCard._id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                handleAnswer(false);
              } else if (swipe > swipeConfidenceThreshold) {
                handleAnswer(true);
              }
            }}
            className="absolute w-full"
          >
            <div 
              className="w-full aspect-[3/2] cursor-pointer relative" 
              onClick={handleFlip}
            >
              {/* Swipe Hints */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isFlipped ? 1 : 0 }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none"
              >
                <div className="flex items-center gap-2 text-red-500">
                  <ArrowLeftIcon className="w-6 h-6" />
                  <span>Incorrect</span>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <span>Correct</span>
                  <ArrowRightIcon className="w-6 h-6" />
                </div>
              </motion.div>

              <motion.div
                className="w-full h-full rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 shadow-lg backface-hidden"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Question
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  {currentCard.question}
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-gray-500 dark:text-gray-400"
                >
                  Click to reveal answer
                </motion.p>
              </motion.div>
              <motion.div
                className="w-full h-full rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 shadow-lg backface-hidden absolute top-0 left-0"
                initial={{ rotateY: 180 }}
                animate={{ rotateY: isFlipped ? 360 : 180 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Answer
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  {currentCard.answer}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feedback Animation */}
        <AnimatePresence>
          {showFeedback.show && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`absolute inset-0 flex items-center justify-center ${
                showFeedback.correct ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <div className="text-9xl">
                {showFeedback.correct ? '✓' : '✗'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <motion.div 
        className="mt-8 flex justify-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFlip}
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <ArrowPathIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </motion.button>
        {isFlipped && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(false)}
              className="p-3 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <XMarkIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(true)}
              className="p-3 rounded-full bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <CheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </motion.button>
          </>
        )}
      </motion.div>

      {/* Box Info */}
      <motion.div 
        className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Currently in Box {currentCard.box}
      </motion.div>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Keyboard Shortcuts
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Flip Card</span>
                  <span className="text-gray-900 dark:text-white">Space / Enter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Correct Answer</span>
                  <span className="text-gray-900 dark:text-white">→ / J</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Incorrect Answer</span>
                  <span className="text-gray-900 dark:text-white">← / F</span>
                </div>
              </div>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="mt-6 w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Review; 