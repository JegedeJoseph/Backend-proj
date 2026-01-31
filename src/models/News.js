const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [300, 'Title cannot be more than 300 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide content']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['events', 'announcements', 'academics', 'sports', 'entertainment', 'general'],
      default: 'general'
    },
    imageUrl: {
      type: String,
      default: null
    },
    author: {
      type: String,
      required: [true, 'Please provide an author name'],
      trim: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    views: {
      type: Number,
      default: 0
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true
  }
);

// Index for search optimization
newsSchema.index({ title: 'text', content: 'text', tags: 'text' });
newsSchema.index({ category: 1, publishedAt: -1 });

// Return JSON without sensitive fields
newsSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('News', newsSchema);
