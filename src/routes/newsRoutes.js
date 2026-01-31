const express = require('express');
const router = express.Router();

const newsController = require('../controllers/newsController');
const { protect } = require('../middleware');

// Public routes
router.get('/', newsController.getNewsArticles);
router.get('/categories', newsController.getCategories);
router.get('/:id', newsController.getNewsArticle);

// Protected routes (Admin - you may want to add admin middleware)
router.post('/', protect, newsController.createNewsArticle);
router.put('/:id', protect, newsController.updateNewsArticle);
router.delete('/:id', protect, newsController.deleteNewsArticle);

module.exports = router;
