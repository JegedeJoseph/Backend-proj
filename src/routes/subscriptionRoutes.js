const express = require('express');
const router = express.Router();

const subscriptionController = require('../controllers/subscriptionController');
const { protect } = require('../middleware');

// Public routes
router.get('/plans', subscriptionController.getPlans);

// Protected routes
router.get('/', protect, subscriptionController.getSubscription);
router.post('/subscribe', protect, subscriptionController.subscribe);
router.post('/cancel', protect, subscriptionController.cancelSubscription);

module.exports = router;
