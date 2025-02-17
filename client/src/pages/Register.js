import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  UserIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const steps = [
  {
    id: 'account',
    title: 'Account Details',
    icon: UserIcon,
  },
  {
    id: 'preferences',
    title: 'Learning Preferences',
    icon: AcademicCapIcon,
  },
  {
    id: 'complete',
    title: 'Complete',
    icon: CheckCircleIcon,
  },
];

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    learningGoal: 'daily',
    studyTime: '15',
    subjects: [],
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validations, setValidations] = useState({
    length: false,
    number: false,
    special: false,
    match: false,
  });
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');

    if (name === 'password') {
      setValidations({
        length: value.length >= 8,
        number: /\d/.test(value),
        special: /[!@#$%^&*]/.test(value),
        match: value === formData.confirmPassword
      });
    } else if (name === 'confirmPassword') {
      setValidations(prev => ({
        ...prev,
        match: value === formData.password
      }));
    }
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < steps.length - 2) {
      if (currentStep === 0 && !Object.values(validations).every(Boolean)) {
        setError('Please complete all password requirements');
        return;
      }
      setCurrentStep(prev => prev + 1);
      return;
    }

    setLoading(true);
    try {
      await register(formData.username, formData.email, formData.password, {
        learningGoal: formData.learningGoal,
        studyTime: formData.studyTime,
        subjects: formData.subjects,
      });
      setCurrentStep(steps.length - 1);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to register. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ satisfied, text }) => (
    <div className="flex items-center space-x-2">
      <div className={`rounded-full p-1 ${satisfied ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
        <CheckCircleIcon className={`w-3 h-3 ${satisfied ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
      </div>
      <span className={`text-sm ${satisfied ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {text}
      </span>
    </div>
  );

  const SubjectButton = ({ subject, icon: Icon, selected }) => (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleSubjectToggle(subject)}
      className={`flex items-center p-4 rounded-lg border ${
        selected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <Icon className={`w-6 h-6 ${
        selected ? 'text-primary-500' : 'text-gray-400'
      }`} />
      <span className={`ml-3 ${
        selected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
      }`}>
        {subject}
      </span>
    </motion.button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  animate={{
                    scale: currentStep >= index ? 1 : 0.8,
                    opacity: currentStep >= index ? 1 : 0.5,
                  }}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= index
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="w-full h-1 mx-2 bg-gray-200 dark:bg-gray-700">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{
                        width: currentStep > index ? '100%' : '0%',
                      }}
                      className="h-full bg-primary-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`text-xs ${
                  currentStep >= index
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === steps.length - 1 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircleIcon className="w-16 h-16 text-green-500 dark:text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Registration Complete!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Welcome to our learning community. Redirecting you to the dashboard...
              </p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start"
                    >
                      <ExclamationCircleIcon className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 mr-3" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {currentStep === 0 ? (
                  <>
                    {/* Account Details Step */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="username"
                          required
                          value={formData.username}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="Choose a username"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <KeyIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <KeyIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <ValidationItem
                        satisfied={validations.length}
                        text="At least 8 characters long"
                      />
                      <ValidationItem
                        satisfied={validations.number}
                        text="Contains at least one number"
                      />
                      <ValidationItem
                        satisfied={validations.special}
                        text="Contains at least one special character"
                      />
                      <ValidationItem
                        satisfied={validations.match}
                        text="Passwords match"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Learning Preferences Step */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        How often do you want to study?
                      </label>
                      <div className="space-y-2">
                        {['daily', 'weekly', 'flexible'].map((goal) => (
                          <label
                            key={goal}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                              formData.learningGoal === goal
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="learningGoal"
                              value={goal}
                              checked={formData.learningGoal === goal}
                              onChange={handleChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                              {goal.charAt(0).toUpperCase() + goal.slice(1)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred study session duration (minutes)
                      </label>
                      <select
                        name="studyTime"
                        value={formData.studyTime}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Select your subjects of interest
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <SubjectButton
                          subject="Languages"
                          icon={BookOpenIcon}
                          selected={formData.subjects.includes('Languages')}
                        />
                        <SubjectButton
                          subject="Science"
                          icon={AcademicCapIcon}
                          selected={formData.subjects.includes('Science')}
                        />
                        <SubjectButton
                          subject="Math"
                          icon={BookOpenIcon}
                          selected={formData.subjects.includes('Math')}
                        />
                        <SubjectButton
                          subject="History"
                          icon={BookOpenIcon}
                          selected={formData.subjects.includes('History')}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between space-x-4">
                  {currentStep > 0 && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <ArrowLeftIcon className="w-4 h-4 mr-2" />
                      Back
                    </motion.button>
                  )}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        {currentStep === steps.length - 2 ? 'Complete' : 'Continue'}
                        <ArrowRightIcon className="ml-2 -mr-1 w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              {currentStep === 0 && (
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          By creating an account, you agree to our{' '}
          <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Privacy Policy
          </a>
        </motion.p>
      </div>
    </div>
  );
};

export default Register; 