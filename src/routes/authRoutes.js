const express = require('express');
const router = express.Router();

const { authController } = require('../controllers');
const { protect } = require('../middleware');
const {
  signupValidation,
  loginValidation,
  changePasswordValidation
} = require('../utils');

// Public routes
router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes (require authentication)
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, changePasswordValidation, authController.changePassword);

module.exports = router;
