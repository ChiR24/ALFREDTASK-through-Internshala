import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  AcademicCapIcon,
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  BookOpenIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);
  const [previousStats, setPreviousStats] = useState(null);
  const { user } = useAuth();

  // Confetti effect function
  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1500
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  useEffect(() => {
    // Check for achievements when stats update
    if (stats && previousStats) {
      // Celebrate mastering new cards
      if (stats.boxStats?.[4]?.count > previousStats.boxStats?.[4]?.count) {
        triggerConfetti();
      }
      // Celebrate reaching total cards milestones (every 10 cards)
      if (Math.floor(stats.totalCards / 10) > Math.floor(previousStats.totalCards / 10)) {
        triggerConfetti();
      }
    }
    setPreviousStats(stats);
  }, [stats]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/flashcards/stats/summary');
      setStats(response.data);
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get('/api/flashcards?limit=5');
      setRecentActivity(response.data);
    } catch (err) {
      console.error('Failed to load recent activity');
    }
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

  const quickActions = [
    {
      title: 'Start Review',
      description: `${stats?.dueToday || 0} cards due today`,
      icon: AcademicCapIcon,
      to: '/review',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-emerald-700',
    },
    {
      title: 'Create Flashcard',
      description: 'Add new cards to your collection',
      icon: PlusIcon,
      to: '/create',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-indigo-700',
    },
    {
      title: 'View Statistics',
      description: 'Track your learning progress',
      icon: ChartBarIcon,
      to: '/statistics',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-violet-700',
    },
  ];

  // Add achievement badges section before Recent Activity
  const renderAchievements = () => {
    const achievements = [];
    
    if (stats?.totalCards >= 10) {
      achievements.push({
        title: 'Card Collector',
        description: 'Created 10+ flashcards',
        icon: SparklesIcon,
        color: 'bg-yellow-500',
      });
    }
    
    if (stats?.boxStats?.[4]?.count >= 5) {
      achievements.push({
        title: 'Master Learner',
        description: 'Mastered 5+ cards',
        icon: FireIcon,
        color: 'bg-purple-500',
      });
    }

    if (achievements.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className={`p-2 ${achievement.color} rounded-lg mr-4`}>
                <achievement.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {achievement.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {achievement.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-primary-100">
            {stats?.dueToday 
              ? `You have ${stats.dueToday} cards to review today.`
              : "You're all caught up with your reviews!"}
          </p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={action.to}
              className="block h-full"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`h-full p-6 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {action.title}
                    </h3>
                    <p className="text-sm text-white text-opacity-90">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Cards</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats?.totalCards || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BookOpenIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Due Today</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats?.dueToday || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <ClockIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mastered</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats?.boxStats?.[4]?.count || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FireIcon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {Math.round(((stats?.boxStats?.[4]?.count || 0) / (stats?.totalCards || 1)) * 100)}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-orange-500 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Box Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Learning Progress
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {stats?.boxStats?.map((box) => (
            <div key={box.box} className="text-center">
              <div className="mb-2">
                <div className="relative mx-auto h-32 w-4">
                  <motion.div
                    initial={{ height: '0%' }}
                    animate={{ height: `${(box.count / (stats.totalCards || 1)) * 100}%` }}
                    transition={{ duration: 1, delay: box.box * 0.1 }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-full"
                  />
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 -z-10 rounded-full" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Box {box.box}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {box.count} cards
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Achievements section before Recent Activity */}
      {renderAchievements()}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <Link
            to="/create"
            className="text-primary-500 hover:text-primary-600 dark:text-primary-400 text-sm font-medium"
          >
            Add New Card
          </Link>
        </div>
        <div className="space-y-4">
          {recentActivity.map((card) => (
            <motion.div
              key={card._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg mr-4">
                <CalendarIcon className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {card.question}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Box {card.box} • {new Date(card.nextReview).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 