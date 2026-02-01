const express = require('express');
const router = express.Router();

const timetableController = require('../controllers/timetableController');
const { protect } = require('../middleware');

// All routes are protected
router.use(protect);

router.get('/', timetableController.getTimetable);
router.put('/', timetableController.updateTimetable);
router.get('/today', timetableController.getTodaySchedule);
router.get('/day/:day', timetableController.getDaySchedule);
router.post('/class', timetableController.addClass);
router.put('/class/:day/:classIndex', timetableController.updateClass);
router.delete('/class/:day/:classIndex', timetableController.deleteClass);

module.exports = router;
