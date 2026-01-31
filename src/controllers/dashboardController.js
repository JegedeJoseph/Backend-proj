const Task = require('../models/Task');
const Timetable = require('../models/Timetable');
const StudyStats = require('../models/StudyStats');
const News = require('../models/News');
const Notification = require('../models/Notification');

/**
 * @desc    Get dashboard stats
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  try {
    // Get or create study stats
    let stats = await StudyStats.findOne({ user: req.user.id });
    if (!stats) {
      stats = await StudyStats.create({ user: req.user.id });
    }

    // Get today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = await Task.countDocuments({
      user: req.user.id,
      isActive: true,
      dueDate: { $gte: today, $lt: tomorrow }
    });

    const completedToday = await Task.countDocuments({
      user: req.user.id,
      isActive: true,
      status: 'completed',
      completedAt: { $gte: today, $lt: tomorrow }
    });

    // Get pending tasks count
    const pendingTasks = await Task.countDocuments({
      user: req.user.id,
      isActive: true,
      status: { $in: ['pending', 'in-progress'] }
    });

    // Get today's schedule
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];

    const timetable = await Timetable.findOne({ user: req.user.id });
    const todayClasses = timetable
      ? timetable.schedule.filter(item => item.day === todayName).length
      : 0;

    // Get upcoming events (tasks due in next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingEvents = await Task.find({
      user: req.user.id,
      isActive: true,
      status: { $ne: 'completed' },
      dueDate: { $gte: today, $lte: nextWeek }
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .select('title dueDate category priority');

    // Get unread notifications count
    const unreadNotifications = await Notification.countDocuments({
      user: req.user.id,
      isActive: true,
      isRead: false
    });

    // Get recent news
    const recentNews = await News.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('title category imageUrl publishedAt');

    res.status(200).json({
      success: true,
      data: {
        studyStreak: stats.studyStreak,
        longestStreak: stats.longestStreak,
        tasksCompleted: stats.totalTasksCompleted,
        minutesStudied: stats.totalMinutesStudied,
        totalDownloads: stats.totalDownloads,
        todayStats: {
          tasks: todayTasks,
          completed: completedToday,
          classes: todayClasses
        },
        pendingTasks,
        upcomingEvents,
        unreadNotifications,
        recentNews
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching dashboard stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Log study session
 * @route   POST /api/dashboard/study-session
 * @access  Private
 */
const logStudySession = async (req, res) => {
  try {
    const { duration, subject } = req.body;

    if (!duration || duration <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid duration in minutes'
      });
    }

    let stats = await StudyStats.findOne({ user: req.user.id });
    if (!stats) {
      stats = await StudyStats.create({ user: req.user.id });
    }

    // Add study session
    stats.studySessions.push({
      date: new Date(),
      duration,
      subject
    });

    // Update total minutes
    stats.totalMinutesStudied += duration;

    // Update streak
    stats.updateStreak();

    await stats.save();

    res.status(200).json({
      success: true,
      message: 'Study session logged successfully',
      data: {
        studyStreak: stats.studyStreak,
        totalMinutesStudied: stats.totalMinutesStudied
      }
    });
  } catch (error) {
    console.error('Log study session error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while logging study session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get study analytics
 * @route   GET /api/dashboard/analytics
 * @access  Private
 */
const getAnalytics = async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    const stats = await StudyStats.findOne({ user: req.user.id });

    if (!stats) {
      return res.status(200).json({
        success: true,
        data: {
          studySessions: [],
          totalMinutes: 0,
          averageMinutesPerDay: 0
        }
      });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Filter sessions by date range
    const sessions = stats.studySessions.filter(
      s => new Date(s.date) >= startDate && new Date(s.date) <= endDate
    );

    // Calculate analytics
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const averageMinutesPerDay = Math.round(totalMinutes / days);

    // Group by day
    const dailyData = {};
    sessions.forEach(s => {
      const day = new Date(s.date).toISOString().split('T')[0];
      if (!dailyData[day]) {
        dailyData[day] = 0;
      }
      dailyData[day] += s.duration;
    });

    res.status(200).json({
      success: true,
      data: {
        period,
        totalMinutes,
        averageMinutesPerDay,
        dailyData,
        studyStreak: stats.studyStreak,
        longestStreak: stats.longestStreak,
        weeklyGoal: stats.weeklyGoal,
        dailyGoal: stats.dailyGoal
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getDashboardStats,
  logStudySession,
  getAnalytics
};
