const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');

/**
 * @desc    Get wallet balance and transactions
 * @route   GET /api/wallet/balance
 * @access  Private
 */
const getWalletBalance = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user.id });

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user.id });
    }

    // Get recent earnings
    const earnings = wallet.transactions
      .filter(t => t.type === 'earning')
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map(t => ({
        source: t.source,
        amount: t.amount,
        date: t.createdAt,
        description: t.description
      }));

    res.status(200).json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
        totalEarnings: wallet.totalEarnings,
        totalWithdrawals: wallet.totalWithdrawals,
        earnings
      }
    });
  } catch (error) {
    console.error('Get wallet balance error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching wallet balance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get wallet transactions
 * @route   GET /api/wallet/transactions
 * @access  Private
 */
const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(200).json({
        success: true,
        data: {
          transactions: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        }
      });
    }

    let transactions = wallet.transactions;

    // Filter by type if provided
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

    // Sort by date descending
    transactions.sort((a, b) => b.createdAt - a.createdAt);

    // Paginate
    const total = transactions.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    transactions = transactions.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Withdraw funds
 * @route   POST /api/wallet/withdraw
 * @access  Private
 */
const withdrawFunds = async (req, res) => {
  try {
    const { amount, accountDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }

    if (!accountDetails || !accountDetails.bankName || !accountDetails.accountNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bank account details'
      });
    }

    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Check minimum withdrawal amount
    const minimumWithdrawal = 1000; // NGN 1000
    if (amount < minimumWithdrawal) {
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal amount is ${minimumWithdrawal} NGN`
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance',
        data: {
          available: wallet.balance,
          requested: amount
        }
      });
    }

    // Deduct from balance
    wallet.balance -= amount;
    wallet.totalWithdrawals += amount;

    // Save bank details if not already saved
    if (!wallet.bankDetails.bankName) {
      wallet.bankDetails = {
        bankName: accountDetails.bankName,
        accountNumber: accountDetails.accountNumber,
        accountName: accountDetails.accountName || ''
      };
    }

    // Add transaction
    const transaction = wallet.addTransaction(
      'withdrawal',
      amount,
      'bank_withdrawal',
      `Withdrawal to ${accountDetails.bankName} - ${accountDetails.accountNumber}`
    );
    transaction.status = 'pending'; // Withdrawals start as pending

    await wallet.save();

    // Create notification
    await Notification.create({
      user: req.user.id,
      title: 'Withdrawal Request',
      message: `Your withdrawal request of ₦${amount.toLocaleString()} has been submitted and is being processed.`,
      type: 'info',
      category: 'wallet'
    });

    res.status(200).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: {
        amount,
        newBalance: wallet.balance,
        reference: transaction.reference,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Withdraw funds error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing withdrawal',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Fund wallet (for testing/development)
 * @route   POST /api/wallet/fund
 * @access  Private
 */
const fundWallet = async (req, res) => {
  try {
    const { amount, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }

    let wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      wallet = await Wallet.create({ user: req.user.id });
    }

    // Add funds
    wallet.balance += amount;
    wallet.addTransaction('credit', amount, 'wallet_funding', `Wallet funded via ${reference || 'direct deposit'}`);

    await wallet.save();

    res.status(200).json({
      success: true,
      message: 'Wallet funded successfully',
      data: {
        amount,
        newBalance: wallet.balance
      }
    });
  } catch (error) {
    console.error('Fund wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while funding wallet',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getWalletBalance,
  getTransactions,
  withdrawFunds,
  fundWallet
};
