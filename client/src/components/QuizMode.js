import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LightBulbIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

const QuizMode = ({ onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!showAnswer && !isComplete) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(null);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showAnswer, isComplete]);

  const fetchQuestions = async () => {
    try {
      // Fetch 10 random mastered cards
      const response = await axios.get('/api/flashcards/mastered?limit=10');
      const cards = response.data;
      
      // Transform cards into quiz questions
      const quizQuestions = cards.map(card => ({
        question: card.question,
        correctAnswer: card.answer,
        options: generateOptions(card.answer, cards),
      }));
      
      setQuestions(quizQuestions);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const generateOptions = (correctAnswer, allCards) => {
    const options = [correctAnswer];
    const otherAnswers = allCards
      .filter(card => card.answer !== correctAnswer)
      .map(card => card.answer);
    
    while (options.length < 4 && otherAnswers.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherAnswers.length);
      options.push(otherAnswers.splice(randomIndex, 1)[0]);
    }
    
    return shuffleArray(options);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    if (answer === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
      playSound('/sounds/correct.mp3');
    } else {
      playSound('/sounds/incorrect.mp3');
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
        setSelectedAnswer(null);
        setTimeLeft(30);
      } else {
        setIsComplete(true);
      }
    }, 2000);
  };

  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);
    audio.play();
  };

  const restartQuiz = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setShowAnswer(false);
    setTimeLeft(30);
    setIsComplete(false);
    setSelectedAnswer(null);
    fetchQuestions();
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      {!isComplete ? (
        <>
          {/* Progress and Timer */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <LightBulbIcon className="w-5 h-5 text-primary-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Question {currentIndex + 1}/{questions.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">{timeLeft}s</span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {questions[currentIndex].question}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-4">
            {questions[currentIndex].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={showAnswer}
                onClick={() => handleAnswer(option)}
                className={`p-4 rounded-lg text-left transition-colors ${
                  showAnswer
                    ? option === questions[currentIndex].correctAnswer
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : option === selectedAnswer
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                {option}
                {showAnswer && option === questions[currentIndex].correctAnswer && (
                  <CheckCircleIcon className="w-5 h-5 inline ml-2 text-green-500" />
                )}
                {showAnswer && option === selectedAnswer && option !== questions[currentIndex].correctAnswer && (
                  <XMarkIcon className="w-5 h-5 inline ml-2 text-red-500" />
                )}
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
          >
            <span className="text-2xl text-primary-600 dark:text-primary-400">
              {Math.round((score / questions.length) * 100)}%
            </span>
          </motion.div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Quiz Complete!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You got {score} out of {questions.length} questions correct.
          </p>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartQuiz}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Try Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Close
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QuizMode; 