const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pastQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PastQuestion',
      required: true
    },
    isPurchased: {
      type: Boolean,
      default: false
    },
    amountPaid: {
      type: Number,
      default: 0
    },
    paymentReference: {
      type: String,
      trim: true
    },
    downloadedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
downloadSchema.index({ user: 1, pastQuestion: 1 }, { unique: true });

// Return JSON without sensitive fields
downloadSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Download', downloadSchema);
