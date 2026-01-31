const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  subject: {
    type: String,
    trim: true
  }
});

const studyStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    studyStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastStudyDate: {
      type: Date
    },
    totalMinutesStudied: {
      type: Number,
      default: 0
    },
    totalTasksCompleted: {
      type: Number,
      default: 0
    },
    totalDownloads: {
      type: Number,
      default: 0
    },
    studySessions: [studySessionSchema],
    weeklyGoal: {
      type: Number, // in minutes
      default: 600 // 10 hours default
    },
    dailyGoal: {
      type: Number, // in minutes
      default: 60 // 1 hour default
    }
  },
  {
    timestamps: true
  }
);

// Update streak
studyStatsSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (this.lastStudyDate) {
    const lastStudy = new Date(this.lastStudyDate);
    lastStudy.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      this.studyStreak += 1;
    } else if (diffDays > 1) {
      this.studyStreak = 1;
    }
    // If diffDays === 0, same day, don't increment
  } else {
    this.studyStreak = 1;
  }
  
  if (this.studyStreak > this.longestStreak) {
    this.longestStreak = this.studyStreak;
  }
  
  this.lastStudyDate = new Date();
};

// Return JSON without sensitive fields
studyStatsSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('StudyStats', studyStatsSchema);
