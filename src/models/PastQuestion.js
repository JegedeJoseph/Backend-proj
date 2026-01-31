const mongoose = require('mongoose');

const pastQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    courseName: {
      type: String,
      required: [true, 'Please provide a course name'],
      trim: true
    },
    courseCode: {
      type: String,
      required: [true, 'Please provide a course code'],
      trim: true,
      uppercase: true
    },
    semester: {
      type: String,
      required: [true, 'Please provide a semester'],
      enum: ['First', 'Second', 'Summer']
    },
    level: {
      type: String,
      required: [true, 'Please provide a level'],
      enum: ['100', '200', '300', '400', '500', '600', 'Postgraduate']
    },
    year: {
      type: String,
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    fileUrl: {
      type: String,
      required: [true, 'Please provide a file URL']
    },
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'image'],
      default: 'pdf'
    },
    fileSize: {
      type: Number,
      default: 0
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    downloads: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isApproved: {
      type: Boolean,
      default: true
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

// Index for search optimization
pastQuestionSchema.index({ courseName: 'text', courseCode: 'text', title: 'text', tags: 'text' });
pastQuestionSchema.index({ courseCode: 1, level: 1, semester: 1 });

// Return JSON without sensitive fields
pastQuestionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('PastQuestion', pastQuestionSchema);
