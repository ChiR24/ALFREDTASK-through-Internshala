import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import {
  SunIcon,
  MoonIcon,
  BellIcon,
  UserIcon,
  PaintBrushIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XMarkIcon,
  ShieldCheckIcon,
  KeyIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user, updatePreferences, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [dailyGoal, setDailyGoal] = useState(user?.preferences?.dailyGoal || 10);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [notifications, setNotifications] = useState({
    dailyReminder: user?.preferences?.notifications?.dailyReminder ?? true,
    achievements: user?.preferences?.notifications?.achievements ?? true
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [timerSettings, setTimerSettings] = useState({
    focusTime: user?.preferences?.timerSettings?.focusTime ?? 25,
    shortBreak: user?.preferences?.timerSettings?.shortBreak ?? 5,
    longBreak: user?.preferences?.timerSettings?.longBreak ?? 15,
    autoStartBreaks: user?.preferences?.timerSettings?.autoStartBreaks ?? false,
    autoStartPomodoros: user?.preferences?.timerSettings?.autoStartPomodoros ?? false,
  });

  const keyboardShortcuts = [
    { key: '⌘R / Ctrl+R', description: 'Quick Review' },
    { key: '⌘N / Ctrl+N', description: 'Add New Card' },
    { key: '⌘/ / Ctrl+/', description: 'Show Shortcuts' },
    { key: '⌘B / Ctrl+B', description: 'Toggle Sidebar' },
    { key: 'Space', description: 'Flip Card' },
    { key: '→', description: 'Mark Card as Correct' },
    { key: '←', description: 'Mark Card as Incorrect' },
    { key: 'Esc', description: 'Close Modals' }
  ];

  const handleDailyGoalChange = async (e) => {
    const value = parseInt(e.target.value, 10);
    setDailyGoal(value);
    setIsSaving(true);
    try {
      await updatePreferences({ dailyGoal: value });
      showSuccessMessage();
    } catch (error) {
      console.error('Failed to update daily goal:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = async (key) => {
    const newNotifications = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(newNotifications);
    setIsSaving(true);
    try {
      await updatePreferences({ notifications: newNotifications });
      showSuccessMessage();
    } catch (error) {
      console.error('Failed to update notifications:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setIsSaving(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      setIsSaving(false);
      return;
    }

    try {
      await axios.patch('/api/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setShowPasswordModal(false);
      showSuccessMessage();
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('/api/auth/account');
      logout();
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const showSuccessMessage = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleTimerSettingChange = async (key, value) => {
    const newSettings = {
      ...timerSettings,
      [key]: value
    };
    setTimerSettings(newSettings);
    setIsSaving(true);
    try {
      await updatePreferences({ timerSettings: newSettings });
      showSuccessMessage();
    } catch (error) {
      console.error('Failed to update timer settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const SettingSection = ({ icon: Icon, title, description, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </motion.div>
  );

  const Switch = ({ checked, onChange }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <motion.span
        layout
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </motion.button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Customize your learning experience
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowKeyboardShortcuts(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <KeyIcon className="w-5 h-5" />
            <span>Keyboard Shortcuts</span>
          </motion.button>
          <AnimatePresence>
            {showSaveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg"
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span>Settings saved!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appearance Settings */}
          <SettingSection
            icon={PaintBrushIcon}
            title="Appearance"
            description="Customize how the app looks"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Dark Mode
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                  </p>
                </div>
                <Switch checked={isDark} onChange={toggleTheme} />
              </div>
            </div>
          </SettingSection>

          {/* Study Goals Settings */}
          <SettingSection
            icon={AcademicCapIcon}
            title="Study Goals"
            description="Set your daily learning targets"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Daily Review Goal
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Cards to review each day
                  </p>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={dailyGoal}
                    onChange={handleDailyGoalChange}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="mt-2 text-center font-medium text-primary-600 dark:text-primary-400">
                    {dailyGoal} cards
                  </div>
                </div>
              </div>
            </div>
          </SettingSection>

          {/* Study Timer Settings */}
          <SettingSection
            icon={ClockIcon}
            title="Study Timer"
            description="Configure your study timer preferences"
          >
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Focus Time</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Duration of each focus session (minutes)
                    </p>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      step="5"
                      value={timerSettings.focusTime}
                      onChange={(e) => handleTimerSettingChange('focusTime', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="mt-1 text-center font-medium text-primary-600 dark:text-primary-400">
                      {timerSettings.focusTime} minutes
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Short Break</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Duration of short breaks (minutes)
                    </p>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      step="1"
                      value={timerSettings.shortBreak}
                      onChange={(e) => handleTimerSettingChange('shortBreak', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="mt-1 text-center font-medium text-primary-600 dark:text-primary-400">
                      {timerSettings.shortBreak} minutes
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Long Break</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Duration of long breaks (minutes)
                    </p>
                    <input
                      type="range"
                      min="15"
                      max="30"
                      step="5"
                      value={timerSettings.longBreak}
                      onChange={(e) => handleTimerSettingChange('longBreak', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="mt-1 text-center font-medium text-primary-600 dark:text-primary-400">
                      {timerSettings.longBreak} minutes
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Auto-start Breaks
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically start break timer
                      </p>
                    </div>
                    <Switch
                      checked={timerSettings.autoStartBreaks}
                      onChange={() => handleTimerSettingChange('autoStartBreaks', !timerSettings.autoStartBreaks)}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Auto-start Focus
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically start next focus session
                      </p>
                    </div>
                    <Switch
                      checked={timerSettings.autoStartPomodoros}
                      onChange={() => handleTimerSettingChange('autoStartPomodoros', !timerSettings.autoStartPomodoros)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SettingSection>

          {/* Notifications Settings */}
          <SettingSection
            icon={BellIcon}
            title="Notifications"
            description="Manage your notification preferences"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Daily Review Reminder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when it's time to review
                  </p>
                </div>
                <Switch 
                  checked={notifications.dailyReminder} 
                  onChange={() => handleNotificationChange('dailyReminder')} 
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Achievement Alerts
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Celebrate your progress
                  </p>
                </div>
                <Switch 
                  checked={notifications.achievements} 
                  onChange={() => handleNotificationChange('achievements')} 
                />
              </div>
            </div>
          </SettingSection>

          {/* Account Settings */}
          <SettingSection
            icon={UserIcon}
            title="Account"
            description="Manage your account settings"
          >
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                    {user?.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user?.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span>Change Password</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    <span>Delete Account</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </SettingSection>
        </div>
      </motion.div>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Keyboard Shortcuts
                </h3>
                <button
                  onClick={() => setShowKeyboardShortcuts(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-mono text-sm">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Change Password
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {passwordError && (
                  <div className="text-red-500 text-sm">{passwordError}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Delete Account
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings; 