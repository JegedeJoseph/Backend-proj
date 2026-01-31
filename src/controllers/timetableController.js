const Timetable = require('../models/Timetable');

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
        schedule: []
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
        schedule: schedule || [],
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
 * @desc    Add schedule item to timetable
 * @route   POST /api/timetable/item
 * @access  Private
 */
const addScheduleItem = async (req, res) => {
  try {
    const { day, time, endTime, course, courseCode, venue, lecturer, type, color, notes } = req.body;

    if (!day || !time || !course) {
      return res.status(400).json({
        success: false,
        message: 'Please provide day, time, and course'
      });
    }

    let timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      timetable = await Timetable.create({
        user: req.user.id,
        schedule: []
      });
    }

    const newItem = {
      day,
      time,
      endTime,
      course,
      courseCode,
      venue: venue || 'TBA',
      lecturer: lecturer || 'TBA',
      type: type || 'lecture',
      color,
      notes
    };

    timetable.schedule.push(newItem);
    await timetable.save();

    res.status(201).json({
      success: true,
      message: 'Schedule item added successfully',
      data: timetable.schedule[timetable.schedule.length - 1]
    });
  } catch (error) {
    console.error('Add schedule item error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding schedule item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update schedule item
 * @route   PUT /api/timetable/item/:itemId
 * @access  Private
 */
const updateScheduleItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;

    const timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    const item = timetable.schedule.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Schedule item not found'
      });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        item[key] = updates[key];
      }
    });

    await timetable.save();

    res.status(200).json({
      success: true,
      message: 'Schedule item updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Update schedule item error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating schedule item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete schedule item
 * @route   DELETE /api/timetable/item/:itemId
 * @access  Private
 */
const deleteScheduleItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    const item = timetable.schedule.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Schedule item not found'
      });
    }

    item.deleteOne();
    await timetable.save();

    res.status(200).json({
      success: true,
      message: 'Schedule item deleted successfully'
    });
  } catch (error) {
    console.error('Delete schedule item error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting schedule item',
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
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    const timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      return res.status(200).json({
        success: true,
        data: {
          day: today,
          schedule: []
        }
      });
    }

    const todaySchedule = timetable.schedule
      .filter(item => item.day === today)
      .sort((a, b) => {
        // Sort by time
        return a.time.localeCompare(b.time);
      });

    res.status(200).json({
      success: true,
      data: {
        day: today,
        schedule: todaySchedule
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

module.exports = {
  getTimetable,
  updateTimetable,
  addScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
  getTodaySchedule
};
