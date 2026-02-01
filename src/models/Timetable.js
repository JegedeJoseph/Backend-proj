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
    // Schedule organized by day index: 0=Sunday, 1=Monday, 2=Tuesday, etc.
    schedule: {
      0: [timetableClassSchema], // Sunday
      1: [timetableClassSchema], // Monday
      2: [timetableClassSchema], // Tuesday
      3: [timetableClassSchema], // Wednesday
      4: [timetableClassSchema], // Thursday
      5: [timetableClassSchema], // Friday
      6: [timetableClassSchema]  // Saturday
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
