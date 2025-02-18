import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  HomeIcon,
  AcademicCapIcon,
  PlusIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  SunIcon,
  MoonIcon,
  XMarkIcon,
  SparklesIcon,
  KeyIcon,
  RocketLaunchIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Sidebar = ({ isOpen, onToggle, isMobile, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const progressValue = useRef(0);
  const progress = useSpring(0);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle if Command/Ctrl key is pressed
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'r':
            e.preventDefault();
            handleQuickReview();
            break;
          case 'n':
            e.preventDefault();
            handleQuickAdd();
            break;
          case '/':
            e.preventDefault();
            setShowShortcuts(true);
            break;
          case 'b':
            e.preventDefault();
            onToggle();
            break;
          default:
            break;
        }
      } else if (e.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToggle]);

  const handleQuickReview = () => {
    navigate('/review');
  };

  const handleQuickAdd = () => {
    navigate('/create');
  };

  const navItems = [
    { 
      path: '/', 
      icon: HomeIcon, 
      label: 'Dashboard',
      description: 'Overview of your learning progress'
    },
    { 
      path: '/review', 
      icon: AcademicCapIcon, 
      label: 'Review',
      description: 'Practice your flashcards'
    },
    { 
      path: '/create', 
      icon: PlusIcon, 
      label: 'Create',
      description: 'Add new flashcards'
    },
    { 
      path: '/statistics', 
      icon: ChartBarIcon, 
      label: 'Statistics',
      description: 'Track your performance'
    },
    { 
      path: '/profile', 
      icon: UserCircleIcon, 
      label: 'Profile',
      description: 'View your achievements'
    },
    { 
      path: '/settings', 
      icon: Cog6ToothIcon, 
      label: 'Settings',
      description: 'Customize your experience'
    },
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarVariants = {
    open: {
      width: '280px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      width: '80px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const quickActions = [
    {
      label: 'Quick Review',
      description: 'Start a 5-card review session',
      icon: RocketLaunchIcon,
      shortcut: '⌘R',
      action: handleQuickReview
    },
    {
      label: 'Add Card',
      description: 'Create a new flashcard',
      icon: PlusIcon,
      shortcut: '⌘N',
      action: handleQuickAdd
    }
  ];

  const keyboardShortcuts = [
    { key: '⌘R', description: 'Quick Review' },
    { key: '⌘N', description: 'New Card' },
    { key: '⌘/', description: 'Show Shortcuts' },
    { key: '⌘B', description: 'Toggle Sidebar' },
    { key: '⌘K', description: 'Search' },
    { key: 'Esc', description: 'Close Modals' },
  ];

  const ProgressIndicator = () => {
    useEffect(() => {
      const fetchStats = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get('/api/flashcards/stats/summary');
          setStats(response.data);
          // Only update progress if it has changed significantly
          if (Math.abs(progressValue.current - response.data.todayProgress) > 1) {
            progressValue.current = response.data.todayProgress;
            progress.set(response.data.todayProgress);
          }
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      // Initial fetch
      fetchStats();
      
      // Only set up polling if the sidebar is open
      let interval;
      if (isOpen) {
        interval = setInterval(fetchStats, 60000); // Poll every minute instead of 30 seconds
      }
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [isOpen]); // Add isOpen as a dependency

    if (isLoading && !stats) {
      return (
        <div className="px-4 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      );
    }

    if (!stats) return null;

    const progressText = stats.dueToday === 0 
      ? "All caught up!" 
      : `${stats.reviewedToday}/${stats.dueToday} cards reviewed`;

    return (
      <div className="px-4 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Today's Progress</span>
          <motion.span 
            className="text-primary-600 dark:text-primary-400 font-medium"
            initial={false}
          >
            {Math.round(progress.get())}%
          </motion.span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 dark:bg-primary-400 rounded-full"
            style={{ width: `${progress.get()}%` }}
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {progressText}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-gray-800 shadow-xl ${
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''
        } transition-transform duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 dark:border-gray-700">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3"
              >
                <SparklesIcon className="w-6 h-6 text-primary-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                  Flashcards
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {isMobile ? (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          ) : (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <motion.div
                animate={{ rotate: isOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </motion.div>
            </button>
          )}
        </div>

        {/* Quick Actions (when sidebar is open) */}
        {isOpen && (
          <div className="px-2 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="mt-2 space-y-1">
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <action.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400" />
                  <div className="ml-3 flex-1">
                    <p className="font-medium">{action.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                    {action.shortcut}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {isOpen && (
          <div className="px-2 py-4 border-b border-gray-100 dark:border-gray-700">
            <ProgressIndicator />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`relative flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <item.icon className={`w-6 h-6 transition-colors duration-200 ${
                isActive(item.path)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
              }`} />
              
              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.div
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="ml-3 flex-1"
                  >
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active indicator */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-full bg-primary-500 rounded-r-full"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Footer with keyboard shortcuts */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
            >
              {isDark ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShortcuts(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
            >
              <KeyIcon className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
            </motion.button>
          </div>
          
          {isOpen && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium">
                {user.username[0].toUpperCase()}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShortcuts(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Keyboard Shortcuts
                </h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {keyboardShortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {shortcut.key}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar; 