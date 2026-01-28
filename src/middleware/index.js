const { protect, optionalAuth } = require('./auth');
const { errorHandler, notFound } = require('./errorHandler');

module.exports = {
  protect,
  optionalAuth,
  errorHandler,
  notFound
};
