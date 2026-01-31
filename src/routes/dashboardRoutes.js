const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware');

// All routes are protected
router.use(protect);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/analytics', dashboardController.getAnalytics);
router.post('/study-session', dashboardController.logStudySession);

module.exports = router;
