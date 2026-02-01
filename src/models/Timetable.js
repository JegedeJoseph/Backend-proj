const mongoose = require('mongoose');

const timetableClassSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    trim: true,
    default: 'TBA'
  },
  professor: {
    type: String,
    trim: true,
    default: 'TBA'
  },
  iconName: {
    type: String,
    default: 'book'
  },
  accentColor: {
    type: String,
    default: 'primary'
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
    // Schedule organized by day name
    schedule: {
      Sunday: [timetableClassSchema],
      Monday: [timetableClassSchema],
      Tuesday: [timetableClassSchema],
      Wednesday: [timetableClassSchema],
      Thursday: [timetableClassSchema],
      Friday: [timetableClassSchema],
      Saturday: [timetableClassSchema]
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

// Return JSON without sensitive fields
timetableSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Timetable', timetableSchema);
