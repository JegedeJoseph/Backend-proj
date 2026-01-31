const News = require('../models/News');

/**
 * @desc    Get all news articles with filters
 * @route   GET /api/news
 * @access  Public
 */
const getNewsArticles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isPublished: true };

    if (category) query.category = category;

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const [articles, total] = await Promise.all([
      News.find(query)
        .select('-content') // Exclude full content for list view
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      News.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        articles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get news articles error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching news articles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get single news article
 * @route   GET /api/news/:id
 * @access  Public
 */
const getNewsArticle = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Increment view count
    article.views += 1;
    await article.save();

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Get news article error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the article',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Create news article (Admin only)
 * @route   POST /api/news
 * @access  Private/Admin
 */
const createNewsArticle = async (req, res) => {
  try {
    const { title, description, content, category, imageUrl, author, tags } = req.body;

    const article = await News.create({
      title,
      description,
      content,
      category,
      imageUrl,
      author: author || req.user.name,
      authorId: req.user.id,
      tags: tags || [],
      publishedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article
    });
  } catch (error) {
    console.error('Create news article error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the article',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update news article
 * @route   PUT /api/news/:id
 * @access  Private/Admin
 */
const updateNewsArticle = async (req, res) => {
  try {
    const { title, description, content, category, imageUrl, tags, isPublished } = req.body;

    const article = await News.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Update fields
    if (title) article.title = title;
    if (description) article.description = description;
    if (content) article.content = content;
    if (category) article.category = category;
    if (imageUrl !== undefined) article.imageUrl = imageUrl;
    if (tags) article.tags = tags;
    if (isPublished !== undefined) article.isPublished = isPublished;

    await article.save();

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: article
    });
  } catch (error) {
    console.error('Update news article error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the article',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete news article
 * @route   DELETE /api/news/:id
 * @access  Private/Admin
 */
const deleteNewsArticle = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    await article.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Delete news article error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the article',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get news categories
 * @route   GET /api/news/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
  try {
    const categories = ['events', 'announcements', 'academics', 'sports', 'entertainment', 'general'];

    // Get article count per category
    const categoryCounts = await News.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const categoryData = categories.map(cat => {
      const found = categoryCounts.find(c => c._id === cat);
      return {
        name: cat,
        count: found ? found.count : 0
      };
    });

    res.status(200).json({
      success: true,
      data: categoryData
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getNewsArticles,
  getNewsArticle,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  getCategories
};
