const express = require('express');
const router = express.Router();

const walletController = require('../controllers/walletController');
const { protect } = require('../middleware');

// All routes are protected
router.use(protect);

router.get('/balance', walletController.getWalletBalance);
router.get('/transactions', walletController.getTransactions);
router.post('/withdraw', walletController.withdrawFunds);
router.post('/fund', walletController.fundWallet);

module.exports = router;
