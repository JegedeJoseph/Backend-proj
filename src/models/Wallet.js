const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit', 'debit', 'withdrawal', 'earning', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  reference: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative']
    },
    currency: {
      type: String,
      default: 'NGN'
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    totalWithdrawals: {
      type: Number,
      default: 0
    },
    transactions: [transactionSchema],
    bankDetails: {
      bankName: {
        type: String,
        trim: true
      },
      accountNumber: {
        type: String,
        trim: true
      },
      accountName: {
        type: String,
        trim: true
      }
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

// Generate unique reference
walletSchema.methods.generateReference = function () {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Add transaction
walletSchema.methods.addTransaction = function (type, amount, source, description = '') {
  const transaction = {
    type,
    amount,
    source,
    description,
    reference: this.generateReference(),
    status: 'completed',
    createdAt: new Date()
  };
  
  this.transactions.push(transaction);
  return transaction;
};

// Return JSON without sensitive fields
walletSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Wallet', walletSchema);
