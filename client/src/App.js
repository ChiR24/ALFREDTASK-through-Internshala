import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import {
  HomeIcon,
  ChevronRightIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Review from './pages/Review';
import CreateFlashcard from './pages/CreateFlashcard';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '': return 'Dashboard';
      case 'review': return 'Review Cards';
      case 'create': return 'Create Flashcard';
      case 'statistics': return 'Statistics';
      case 'profile': return 'Profile';
      case 'settings': return 'Settings';
      default: return pathname.charAt(0).toUpperCase() + pathname.slice(1);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-primary-500 dark:hover:text-primary-400">
        <HomeIcon className="w-4 h-4" />
      </Link>
      {pathnames.map((name, index) => (
        <React.Fragment key={name}>
          <ChevronRightIcon className="w-4 h-4" />
          <Link
            to={`/${pathnames.slice(0, index + 1).join('/')}`}
            className="hover:text-primary-500 dark:hover:text-primary-400"
          >
            {getPageTitle(name)}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'You have 5 cards due for review', time: '5m ago' },
    { id: 2, message: 'Congratulations! You mastered 3 new cards', time: '1h ago' },
  ]);

  return (
    <header className="h-16 px-4 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <Breadcrumbs />
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search flashcards..."
            className="w-64 px-4 py-2 pl-10 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
          >
            <BellIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    >
                      <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { user } = useAuth();

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(prev => !prev)}
        isMobile={isMobile}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? (isMobile ? 'ml-0' : 'ml-[280px]') : 'ml-20'
        }`}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="h-full px-4 md:px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <PageTransition>
                          <Dashboard />
                        </PageTransition>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/review"
                    element={
                      <PrivateRoute>
                        <PageTransition>
                          <Review />
                        </PageTransition>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/create"
                    element={
                      <PrivateRoute>
                        <PageTransition>
                          <CreateFlashcard />
                        </PageTransition>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/statistics"
                    element={
                      <PrivateRoute>
                        <PageTransition>
                          <Statistics />
                        </PageTransition>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <PageTransition>
                          <Profile />
                        </PageTransition>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <PageTransition>
                          <Settings />
                        </PageTransition>
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 