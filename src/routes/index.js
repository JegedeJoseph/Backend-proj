const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const pastQuestionRoutes = require('./pastQuestionRoutes');
const newsRoutes = require('./newsRoutes');
const userRoutes = require('./userRoutes');
const walletRoutes = require('./walletRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const timetableRoutes = require('./timetableRoutes');
const taskRoutes = require('./taskRoutes');
const notificationRoutes = require('./notificationRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/past-questions', pastQuestionRoutes);
router.use('/news', newsRoutes);
router.use('/users', userRoutes);
router.use('/wallet', walletRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/timetable', timetableRoutes);
router.use('/tasks', taskRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      pastQuestions: '/api/past-questions',
      news: '/api/news',
      users: '/api/users',
      wallet: '/api/wallet',
      subscription: '/api/subscription',
      timetable: '/api/timetable',
      tasks: '/api/tasks',
      notifications: '/api/notifications',
      dashboard: '/api/dashboard'
    }
  });
});

module.exports = router;
