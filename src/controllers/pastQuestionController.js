const PastQuestion = require('../models/PastQuestion');
const Download = require('../models/Download');
const Wallet = require('../models/Wallet');
const StudyStats = require('../models/StudyStats');

/**
 * @desc    Upload a past question
 * @route   POST /api/past-questions/upload
 * @access  Private
 */
const uploadPastQuestion = async (req, res) => {
  try {
    const { courseName, courseCode, semester, level, year, tags, isPaid, price, title } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Create past question
    const pastQuestion = await PastQuestion.create({
      title: title || `${courseCode} - ${semester} Semester ${year || ''}`.trim(),
      courseName,
      courseCode: courseCode.toUpperCase(),
      semester,
      level,
      year,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      fileUrl: req.file.path || req.file.location, // Works with local storage or cloud storage
      fileType: req.file.mimetype.includes('pdf') ? 'pdf' : 
                req.file.mimetype.includes('doc') ? 'doc' : 
                req.file.mimetype.includes('image') ? 'image' : 'pdf',
      fileSize: req.file.size,
      isPaid: isPaid === 'true' || isPaid === true,
      price: isPaid ? parseFloat(price) || 0 : 0,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Past question uploaded successfully',
      data: pastQuestion
    });
  } catch (error) {
    console.error('Upload past question error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while uploading the past question',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all past questions with filters
 * @route   GET /api/past-questions
 * @access  Public
 */
const getPastQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      courseCode,
      courseName,
      semester,
      level,
      search,
      isPaid,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true, isApproved: true };

    if (courseCode) query.courseCode = courseCode.toUpperCase();
    if (courseName) query.courseName = { $regex: courseName, $options: 'i' };
    if (semester) query.semester = semester;
    if (level) query.level = level;
    if (isPaid !== undefined) query.isPaid = isPaid === 'true';

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const [questions, total] = await Promise.all([
      PastQuestion.find(query)
        .populate('uploadedBy', 'name')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      PastQuestion.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        questions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get past questions error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching past questions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get single past question
 * @route   GET /api/past-questions/:id
 * @access  Public
 */
const getPastQuestion = async (req, res) => {
  try {
    const question = await PastQuestion.findById(req.params.id)
      .populate('uploadedBy', 'name');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Past question not found'
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Get past question error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the past question',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Download/Purchase a past question
 * @route   POST /api/past-questions/:id/download
 * @access  Private
 */
const downloadPastQuestion = async (req, res) => {
  try {
    const question = await PastQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Past question not found'
      });
    }

    // Check if user already downloaded/purchased
    let download = await Download.findOne({
      user: req.user.id,
      pastQuestion: question._id
    });

    if (download) {
      // Already downloaded/purchased
      return res.status(200).json({
        success: true,
        message: 'You have already purchased this question',
        data: {
          fileUrl: question.fileUrl,
          alreadyPurchased: true
        }
      });
    }

    // If it's a paid question, process payment
    if (question.isPaid && question.price > 0) {
      const wallet = await Wallet.findOne({ user: req.user.id });

      if (!wallet || wallet.balance < question.price) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance',
          data: {
            required: question.price,
            available: wallet ? wallet.balance : 0
          }
        });
      }

      // Deduct from buyer's wallet
      wallet.balance -= question.price;
      wallet.addTransaction('debit', question.price, 'past_question_purchase', `Purchased: ${question.title}`);
      await wallet.save();

      // Credit uploader's wallet
      let uploaderWallet = await Wallet.findOne({ user: question.uploadedBy });
      if (!uploaderWallet) {
        uploaderWallet = await Wallet.create({ user: question.uploadedBy });
      }
      const earnings = question.price * 0.7; // 70% to uploader
      uploaderWallet.balance += earnings;
      uploaderWallet.totalEarnings += earnings;
      uploaderWallet.addTransaction('earning', earnings, 'past_question_sale', `Sale: ${question.title}`);
      await uploaderWallet.save();

      download = await Download.create({
        user: req.user.id,
        pastQuestion: question._id,
        isPurchased: true,
        amountPaid: question.price
      });
    } else {
      // Free download
      download = await Download.create({
        user: req.user.id,
        pastQuestion: question._id,
        isPurchased: false,
        amountPaid: 0
      });
    }

    // Update download count
    question.downloads += 1;
    await question.save();

    // Update user study stats
    let stats = await StudyStats.findOne({ user: req.user.id });
    if (stats) {
      stats.totalDownloads += 1;
      await stats.save();
    }

    res.status(200).json({
      success: true,
      message: question.isPaid ? 'Purchase successful' : 'Download started',
      data: {
        fileUrl: question.fileUrl,
        download
      }
    });
  } catch (error) {
    console.error('Download past question error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Rate a past question
 * @route   POST /api/past-questions/:id/rate
 * @access  Private
 */
const ratePastQuestion = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating between 1 and 5'
      });
    }

    const question = await PastQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Past question not found'
      });
    }

    // Check if user has downloaded this question
    const download = await Download.findOne({
      user: req.user.id,
      pastQuestion: question._id
    });

    if (!download) {
      return res.status(400).json({
        success: false,
        message: 'You must download the question before rating'
      });
    }

    // Calculate new rating
    const newRatingCount = question.ratingCount + 1;
    const newRating = ((question.rating * question.ratingCount) + rating) / newRatingCount;

    question.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal
    question.ratingCount = newRatingCount;
    await question.save();

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        rating: question.rating,
        ratingCount: question.ratingCount
      }
    });
  } catch (error) {
    console.error('Rate past question error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your rating',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get user's uploaded past questions
 * @route   GET /api/past-questions/my-uploads
 * @access  Private
 */
const getMyUploads = async (req, res) => {
  try {
    const questions = await PastQuestion.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Get my uploads error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching your uploads',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  uploadPastQuestion,
  getPastQuestions,
  getPastQuestion,
  downloadPastQuestion,
  ratePastQuestion,
  getMyUploads
};
