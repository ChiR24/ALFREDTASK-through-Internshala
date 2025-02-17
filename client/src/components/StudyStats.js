import React from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  CheckCircleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const StatCard = ({ icon: Icon, title, value, subtitle, trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
      <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center space-x-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`flex items-center space-x-1 text-sm ${
            trend.type === 'increase'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          <span>{trend.value}</span>
          <span>{trend.label}</span>
        </motion.div>
      </div>
    )}
  </motion.div>
);

const ActivityHeatmap = ({ data }) => {
  const today = new Date();
  const days = Array.from({ length: 91 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (90 - i));
    return date;
  });

  const getActivityLevel = (date) => {
    const activity = data[date.toISOString().split('T')[0]] || 0;
    if (activity === 0) return 'bg-gray-100 dark:bg-gray-700';
    if (activity < 5) return 'bg-primary-200 dark:bg-primary-900';
    if (activity < 10) return 'bg-primary-300 dark:bg-primary-800';
    if (activity < 15) return 'bg-primary-400 dark:bg-primary-700';
    return 'bg-primary-500 dark:bg-primary-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center space-x-2 mb-6">
        <CalendarIcon className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Study Activity
        </h3>
      </div>
      <div className="grid grid-cols-13 gap-1">
        {days.map((date, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.005 }}
            className={`w-3 h-3 rounded-sm ${getActivityLevel(date)}`}
            title={`${date.toLocaleDateString()}: ${data[date.toISOString().split('T')[0]] || 0} cards`}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700" />
          <div className="w-3 h-3 rounded-sm bg-primary-200 dark:bg-primary-900" />
          <div className="w-3 h-3 rounded-sm bg-primary-300 dark:bg-primary-800" />
          <div className="w-3 h-3 rounded-sm bg-primary-400 dark:bg-primary-700" />
          <div className="w-3 h-3 rounded-sm bg-primary-500 dark:bg-primary-600" />
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
};

const StudyStats = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FireIcon}
          title="Current Streak"
          value={`${stats.currentStreak} days`}
          trend={{
            type: 'increase',
            value: '+5',
            label: 'vs last week'
          }}
        />
        <StatCard
          icon={ChartBarIcon}
          title="Cards Reviewed"
          value={stats.cardsReviewed}
          subtitle="Last 7 days"
          trend={{
            type: 'increase',
            value: '+12%',
            label: 'vs previous period'
          }}
        />
        <StatCard
          icon={ClockIcon}
          title="Study Time"
          value={`${stats.studyTime}h`}
          subtitle="This week"
          trend={{
            type: 'increase',
            value: '+2.5h',
            label: 'vs last week'
          }}
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Accuracy Rate"
          value={`${stats.accuracyRate}%`}
          subtitle="Last 100 cards"
          trend={{
            type: 'increase',
            value: '+3%',
            label: 'vs previous 100'
          }}
        />
      </div>
      
      <ActivityHeatmap data={stats.activityData} />
    </div>
  );
};

export default StudyStats; 