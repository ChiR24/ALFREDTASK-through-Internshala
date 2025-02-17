import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  AcademicCapIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  CalendarIcon,
  ChartBarIcon,
  SparklesIcon,
  StarIcon,
  LightBulbIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/flashcards/stats/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const achievements = [
    {
      title: 'Quick Learner',
      description: 'Created first 10 flashcards',
      icon: AcademicCapIcon,
      earned: stats?.totalCards >= 10,
      progress: Math.min(stats?.totalCards || 0, 10),
      total: 10,
      color: 'from-blue-500 to-blue-600',
      reward: '🎓 Learning Pioneer Badge',
    },
    {
      title: 'Master Mind',
      description: 'Mastered 5 cards',
      icon: TrophyIcon,
      earned: stats?.boxStats?.[4]?.count >= 5,
      progress: Math.min(stats?.boxStats?.[4]?.count || 0, 5),
      total: 5,
      color: 'from-purple-500 to-purple-600',
      reward: '🏆 Memory Master Badge',
    },
    {
      title: 'Dedicated Student',
      description: 'Completed 7 days streak',
      icon: FireIcon,
      earned: false,
      progress: 4,
      total: 7,
      color: 'from-orange-500 to-orange-600',
      reward: '🔥 Dedication Badge',
    },
    {
      title: 'Knowledge Seeker',
      description: 'Created cards in 3 different categories',
      icon: BookOpenIcon,
      earned: true,
      progress: 3,
      total: 3,
      color: 'from-green-500 to-green-600',
      reward: '📚 Diverse Learning Badge',
    },
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 bg-gradient-to-br ${color} rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'achievements', label: 'Achievements', icon: TrophyIcon },
    { id: 'activity', label: 'Activity', icon: CalendarIcon },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative w-24 h-24"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full" />
            <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-full" />
            <div className="absolute inset-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user?.username[0].toUpperCase()}
            </div>
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              {user?.username}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-2 mt-2"
            >
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <p className="text-primary-500 dark:text-primary-400">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Cards"
          value={stats?.totalCards || 0}
          icon={AcademicCapIcon}
          color="from-blue-500 to-blue-600"
          subtitle="Created flashcards"
        />
        <StatCard
          title="Due Today"
          value={stats?.dueToday || 0}
          icon={ClockIcon}
          color="from-green-500 to-green-600"
          subtitle="Cards to review"
        />
        <StatCard
          title="Mastered"
          value={stats?.boxStats?.[4]?.count || 0}
          icon={TrophyIcon}
          color="from-purple-500 to-purple-600"
          subtitle="In Box 5"
        />
        <StatCard
          title="Success Rate"
          value={`${Math.round(((stats?.boxStats?.[4]?.count || 0) / (stats?.totalCards || 1)) * 100)}%`}
          icon={ChartBarIcon}
          color="from-orange-500 to-orange-600"
          subtitle="Overall performance"
        />
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 relative flex items-center space-x-2 ${
                  selectedTab === tab.id
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {selectedTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {selectedTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Learning Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                  <LightBulbIcon className="w-5 h-5 mr-2 text-primary-500" />
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
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Tip:</span> Cards in higher boxes are reviewed less frequently. Focus on mastering cards in lower boxes first.
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-primary-500" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg mr-4">
                        <CalendarIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          Reviewed 5 cards
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          2 hours ago
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          80% success
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'achievements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.title}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer ${
                      achievement.earned ? 'bg-gradient-to-br bg-opacity-10' : ''
                    }`}
                    onClick={() => setSelectedAchievement(achievement)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-4 bg-gradient-to-br ${achievement.color} rounded-xl mb-4`}>
                        <achievement.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {achievement.description}
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          className={`h-full rounded-full bg-gradient-to-r ${achievement.color}`}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {achievement.progress}/{achievement.total}
                        </span>
                        {achievement.earned && (
                          <SparklesIcon className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <StarIcon className="w-5 h-5 mr-2 text-primary-500" />
                  Achievement Progress
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {achievements.filter(a => a.earned).length}/{achievements.length}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Achievements unlocked
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {Math.round((achievements.filter(a => a.earned).length / achievements.length) * 100)}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Completion rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'activity' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-900 dark:text-white font-medium">
                          Completed daily review
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {index + 1} day{index === 0 ? '' : 's'} ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Reviewed 10 cards • 80% success rate
                      </p>
                      <div className="mt-2 flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          8 correct
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          2 incorrect
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-6 bg-gradient-to-br ${selectedAchievement.color} rounded-xl mb-4`}>
                  <selectedAchievement.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedAchievement.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedAchievement.description}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(selectedAchievement.progress / selectedAchievement.total) * 100}%` }}
                    className={`h-full rounded-full bg-gradient-to-r ${selectedAchievement.color}`}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Progress: {selectedAchievement.progress}/{selectedAchievement.total}
                </p>
                {selectedAchievement.earned ? (
                  <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      {selectedAchievement.reward}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400">
                      Keep going! You're making progress.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile; 