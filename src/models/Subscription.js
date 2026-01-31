const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    startsAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: null
    },
    autoRenew: {
      type: Boolean,
      default: false
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'wallet', 'bank', 'none'],
      default: 'none'
    },
    paymentReference: {
      type: String,
      trim: true
    },
    features: {
      unlimitedDownloads: {
        type: Boolean,
        default: false
      },
      prioritySupport: {
        type: Boolean,
        default: false
      },
      noAds: {
        type: Boolean,
        default: false
      },
      exclusiveContent: {
        type: Boolean,
        default: false
      }
    },
    history: [{
      plan: String,
      startsAt: Date,
      expiresAt: Date,
      amount: Number,
      paymentReference: String
    }]
  },
  {
    timestamps: true
  }
);

// Check if subscription is valid
subscriptionSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.plan === 'free') return true;
  if (!this.expiresAt) return false;
  return new Date() < this.expiresAt;
};

// Return JSON without sensitive fields
subscriptionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  obj.isActive = this.isValid();
  return obj;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
