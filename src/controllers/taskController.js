const Task = require('../models/Task');
const StudyStats = require('../models/StudyStats');

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      priority,
      category,
      dueDate,
      sortBy = 'dueDate',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    const query = { user: req.user.id, isActive: true };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    // Filter by due date
    if (dueDate) {
      const startOfDay = new Date(dueDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dueDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Create task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      dueTime,
      priority,
      category,
      course,
      tags,
      reminder
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a task title'
      });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      dueTime,
      priority: priority || 'medium',
      category: category || 'study',
      course,
      tags: tags || [],
      reminder: reminder || { enabled: false }
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const {
      title,
      description,
      dueDate,
      dueTime,
      priority,
      status,
      category,
      course,
      tags,
      reminder
    } = req.body;

    // Update fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (dueTime !== undefined) task.dueTime = dueTime;
    if (priority) task.priority = priority;
    if (category) task.category = category;
    if (course !== undefined) task.course = course;
    if (tags) task.tags = tags;
    if (reminder) task.reminder = reminder;

    // Handle status change
    if (status) {
      task.status = status;
      if (status === 'completed' && !task.completedAt) {
        task.completedAt = new Date();

        // Update study stats
        let stats = await StudyStats.findOne({ user: req.user.id });
        if (!stats) {
          stats = await StudyStats.create({ user: req.user.id });
        }
        stats.totalTasksCompleted += 1;
        await stats.save();
      }
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Soft delete
    task.isActive = false;
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get upcoming tasks
 * @route   GET /api/tasks/upcoming
 * @access  Private
 */
const getUpcomingTasks = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + parseInt(days));

    const tasks = await Task.find({
      user: req.user.id,
      isActive: true,
      status: { $ne: 'completed' },
      dueDate: { $gte: now, $lte: futureDate }
    }).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get upcoming tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching upcoming tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get overdue tasks
 * @route   GET /api/tasks/overdue
 * @access  Private
 */
const getOverdueTasks = async (req, res) => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      user: req.user.id,
      isActive: true,
      status: { $nin: ['completed', 'cancelled'] },
      dueDate: { $lt: now }
    }).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get overdue tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching overdue tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getUpcomingTasks,
  getOverdueTasks
};
