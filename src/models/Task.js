const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    dueDate: {
      type: Date
    },
    dueTime: {
      type: String
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    category: {
      type: String,
      enum: ['study', 'assignment', 'exam', 'project', 'personal', 'other'],
      default: 'study'
    },
    course: {
      type: String,
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    reminder: {
      enabled: {
        type: Boolean,
        default: false
      },
      time: {
        type: Date
      }
    },
    completedAt: {
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
taskSchema.index({ user: 1, status: 1, dueDate: 1 });
taskSchema.index({ user: 1, category: 1 });

// Return JSON without sensitive fields
taskSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Task', taskSchema);
