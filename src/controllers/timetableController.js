const Timetable = require('../models/Timetable');

// Helper to create empty schedule structure
const createEmptySchedule = () => ({
  0: [], // Sunday
  1: [], // Monday
  2: [], // Tuesday
  3: [], // Wednesday
  4: [], // Thursday
  5: [], // Friday
  6: []  // Saturday
});

/**
 * @desc    Get user timetable
 * @route   GET /api/timetable
 * @access  Private
 */
const getTimetable = async (req, res) => {
  try {
    let timetable = await Timetable.findOne({ user: req.user.id });

    // Create empty timetable if none exists
    if (!timetable) {
      timetable = await Timetable.create({
        user: req.user.id,
        schedule: createEmptySchedule()
      });
    }

    res.status(200).json({
      success: true,
      data: {
        semester: timetable.semester,
        academicYear: timetable.academicYear,
        schedule: timetable.schedule
      }
    });
  } catch (error) {
    console.error('Get timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching timetable',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update/Replace timetable
 * @route   PUT /api/timetable
 * @access  Private
 */
const updateTimetable = async (req, res) => {
  try {
    const { schedule, semester, academicYear } = req.body;

    let timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      timetable = await Timetable.create({
        user: req.user.id,
        schedule: schedule || createEmptySchedule(),
        semester,
        academicYear
      });
    } else {
      if (schedule) timetable.schedule = schedule;
      if (semester) timetable.semester = semester;
      if (academicYear) timetable.academicYear = academicYear;
      await timetable.save();
    }

    res.status(200).json({
      success: true,
      message: 'Timetable updated successfully',
      data: {
        semester: timetable.semester,
        academicYear: timetable.academicYear,
        schedule: timetable.schedule
      }
    });
  } catch (error) {
    console.error('Update timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating timetable',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Add class to a specific day
 * @route   POST /api/timetable/class
 * @access  Private
 */
const addClass = async (req, res) => {
  try {
    const { dayIndex, classData } = req.body;

    // Support both nested classData and flat structure
    const data = classData || req.body;
    const { courseCode, courseName, startTime, endTime, location, professor, iconName, accentColor } = data;

    // Validate dayIndex (0-6)
    if (dayIndex === undefined || dayIndex < 0 || dayIndex > 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid day index (0-6, where 0=Sunday)'
      });
    }

    if (!courseCode || !courseName || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseCode, courseName, startTime, and endTime'
      });
    }

    let timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      timetable = await Timetable.create({
        user: req.user.id,
        schedule: createEmptySchedule()
      });
    }

    const newClass = {
      courseCode: courseCode.toUpperCase(),
      courseName,
      startTime,
      endTime,
      location: location || 'TBA',
      professor: professor || 'TBA',
      iconName: iconName || 'book',
      accentColor: accentColor || 'primary'
    };

    // Add class to the specific day
    if (!timetable.schedule[dayIndex]) {
      timetable.schedule[dayIndex] = [];
    }
    timetable.schedule[dayIndex].push(newClass);
    timetable.markModified('schedule');
    await timetable.save();

    res.status(201).json({
      success: true,
      message: 'Class added successfully',
      data: {
        dayIndex,
        class: timetable.schedule[dayIndex][timetable.schedule[dayIndex].length - 1]
      }
    });
  } catch (error) {
    console.error('Add class error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding class',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update a class in the timetable
 * @route   PUT /api/timetable/class/:dayIndex/:classIndex
 * @access  Private
 */
const updateClass = async (req, res) => {
  try {
    const { dayIndex, classIndex } = req.params;
    const updates = req.body;

    const timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    if (!timetable.schedule[dayIndex] || !timetable.schedule[dayIndex][classIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Update fields
    const classItem = timetable.schedule[dayIndex][classIndex];
    if (updates.courseCode) classItem.courseCode = updates.courseCode.toUpperCase();
    if (updates.courseName) classItem.courseName = updates.courseName;
    if (updates.startTime) classItem.startTime = updates.startTime;
    if (updates.endTime) classItem.endTime = updates.endTime;
    if (updates.location !== undefined) classItem.location = updates.location;
    if (updates.professor !== undefined) classItem.professor = updates.professor;
    if (updates.iconName !== undefined) classItem.iconName = updates.iconName;
    if (updates.accentColor !== undefined) classItem.accentColor = updates.accentColor;

    timetable.markModified('schedule');
    await timetable.save();

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: timetable.schedule[dayIndex][classIndex]
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating class',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete a class from the timetable
 * @route   DELETE /api/timetable/class/:dayIndex/:classIndex
 * @access  Private
 */
const deleteClass = async (req, res) => {
  try {
    const { dayIndex, classIndex } = req.params;

    const timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    if (!timetable.schedule[dayIndex] || !timetable.schedule[dayIndex][classIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Remove the class
    timetable.schedule[dayIndex].splice(classIndex, 1);
    timetable.markModified('schedule');
    await timetable.save();

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting class',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get today's schedule
 * @route   GET /api/timetable/today
 * @access  Private
 */
const getTodaySchedule = async (req, res) => {
  try {
    const dayIndex = new Date().getDay(); // 0=Sunday, 1=Monday, etc.
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable || !timetable.schedule[dayIndex]) {
      return res.status(200).json({
        success: true,
        data: {
          dayIndex,
          dayName: dayNames[dayIndex],
          classes: []
        }
      });
    }

    // Sort classes by start time
    const todayClasses = [...timetable.schedule[dayIndex]].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });

    res.status(200).json({
      success: true,
      data: {
        dayIndex,
        dayName: dayNames[dayIndex],
        classes: todayClasses
      }
    });
  } catch (error) {
    console.error('Get today schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching today\'s schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get schedule for a specific day
 * @route   GET /api/timetable/day/:dayIndex
 * @access  Private
 */
const getDaySchedule = async (req, res) => {
  try {
    const { dayIndex } = req.params;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (dayIndex < 0 || dayIndex > 6) {
      return res.status(400).json({
        success: false,
        message: 'Invalid day index. Use 0-6 (0=Sunday)'
      });
    }

    const timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable || !timetable.schedule[dayIndex]) {
      return res.status(200).json({
        success: true,
        data: {
          dayIndex: parseInt(dayIndex),
          dayName: dayNames[dayIndex],
          classes: []
        }
      });
    }

    // Sort classes by start time
    const dayClasses = [...timetable.schedule[dayIndex]].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });

    res.status(200).json({
      success: true,
      data: {
        dayIndex: parseInt(dayIndex),
        dayName: dayNames[dayIndex],
        classes: dayClasses
      }
    });
  } catch (error) {
    console.error('Get day schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getTimetable,
  updateTimetable,
  addClass,
  updateClass,
  deleteClass,
  getTodaySchedule,
  getDaySchedule
};
