const { protect, optionalAuth } = require('./auth');
const { errorHandler, notFound } = require('./errorHandler');
const { uploadPastQuestion, uploadAvatar, handleMulterError } = require('./upload');

module.exports = {
  protect,
  optionalAuth,
  errorHandler,
  notFound,
  uploadPastQuestion,
  uploadAvatar,
  handleMulterError
};
