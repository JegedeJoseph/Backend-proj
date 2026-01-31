const express = require('express');
const router = express.Router();

const pastQuestionController = require('../controllers/pastQuestionController');
const { protect } = require('../middleware');
const { uploadPastQuestion, handleMulterError } = require('../middleware/upload');

// Public routes
router.get('/', pastQuestionController.getPastQuestions);
router.get('/:id', pastQuestionController.getPastQuestion);

// Protected routes
router.post(
  '/upload',
  protect,
  uploadPastQuestion.single('file'),
  handleMulterError,
  pastQuestionController.uploadPastQuestion
);

router.post('/:id/download', protect, pastQuestionController.downloadPastQuestion);
router.post('/:id/rate', protect, pastQuestionController.ratePastQuestion);
router.get('/user/my-uploads', protect, pastQuestionController.getMyUploads);

module.exports = router;
