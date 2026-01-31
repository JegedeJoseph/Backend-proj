const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a notification title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Please provide a notification message'],
      trim: true,
      maxlength: [500, 'Message cannot be more than 500 characters']
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error', 'reminder', 'news', 'promotion'],
      default: 'info'
    },
    category: {
      type: String,
      enum: ['system', 'task', 'timetable', 'news', 'wallet', 'subscription', 'general'],
      default: 'general'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    },
    actionUrl: {
      type: String,
      trim: true
    },
    actionData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    expiresAt: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, category: 1 });

// Return JSON without sensitive fields
notificationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Notification', notificationSchema);
