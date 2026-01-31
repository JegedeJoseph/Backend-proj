const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const { protect } = require('../middleware');
const { uploadAvatar, handleMulterError } = require('../middleware/upload');

// All routes are protected
router.use(protect);

router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.post(
  '/avatar',
  uploadAvatar.single('avatar'),
  handleMulterError,
  profileController.uploadAvatar
);

module.exports = router;
