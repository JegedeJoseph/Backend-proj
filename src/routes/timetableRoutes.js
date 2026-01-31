const express = require('express');
const router = express.Router();

const timetableController = require('../controllers/timetableController');
const { protect } = require('../middleware');

// All routes are protected
router.use(protect);

router.get('/', timetableController.getTimetable);
router.put('/', timetableController.updateTimetable);
router.get('/today', timetableController.getTodaySchedule);
router.post('/item', timetableController.addScheduleItem);
router.put('/item/:itemId', timetableController.updateScheduleItem);
router.delete('/item/:itemId', timetableController.deleteScheduleItem);

module.exports = router;
