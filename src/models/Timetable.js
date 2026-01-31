const mongoose = require('mongoose');

const scheduleItemSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  time: {
    type: String,
    required: true
  },
  endTime: {
    type: String
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  courseCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  venue: {
    type: String,
    trim: true,
    default: 'TBA'
  },
  lecturer: {
    type: String,
    trim: true,
    default: 'TBA'
  },
  type: {
    type: String,
    enum: ['lecture', 'tutorial', 'lab', 'seminar', 'exam', 'other'],
    default: 'lecture'
  },
  color: {
    type: String,
    default: '#4A90A4'
  },
  notes: {
    type: String,
    trim: true
  }
});

const timetableSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    semester: {
      type: String,
      enum: ['First', 'Second', 'Summer'],
      default: 'First'
    },
    academicYear: {
      type: String,
      trim: true
    },
    schedule: [scheduleItemSchema],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Return JSON without sensitive fields
timetableSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Timetable', timetableSchema);
