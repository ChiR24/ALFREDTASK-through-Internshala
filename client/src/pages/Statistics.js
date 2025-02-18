import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    // Only fetch once when component mounts
    fetchStats();
  }, []); // Empty dependency array for initial mount only

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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

  const statCards = [
    {
      title: 'Total Flashcards',
      value: stats?.totalCards || 0,
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Due Today',
      value: stats?.dueToday || 0,
      icon: ClockIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Mastered',
      value: stats?.boxStats?.[4]?.count || 0,
      icon: CheckCircleIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Learning Rate',
      value: `${Math.round(
        ((stats?.boxStats?.[4]?.count || 0) / (stats?.totalCards || 1)) * 100
      )}%`,
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Learning Statistics
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your progress and learning journey
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 ${stat.color} rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Box Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Leitner Box Distribution
        </h3>
        <div className="grid grid-cols-5 gap-8">
          {stats?.boxStats?.map((box) => (
            <div key={box.box} className="text-center">
              <div className="relative h-40">
                <motion.div
                  initial={{ height: '0%' }}
                  animate={{
                    height: `${(box.count / (stats.totalCards || 1)) * 100}%`,
                  }}
                  transition={{ duration: 1, delay: box.box * 0.1 }}
                  className="absolute bottom-0 w-full bg-primary-500 dark:bg-primary-600 rounded-t-lg"
                />
              </div>
              <p className="mt-2 font-medium text-gray-700 dark:text-gray-300">
                Box {box.box}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{box.count} cards</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {Math.round((box.count / (stats.totalCards || 1)) * 100)}%
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Learning Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Learning Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Spaced Repetition
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cards in higher boxes are reviewed less frequently. Focus on mastering cards
              in lower boxes first.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Regular Review
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Try to review your due cards daily to maintain a steady learning progress.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Statistics; 