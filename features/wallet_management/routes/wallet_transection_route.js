const express = require('express');
const router = express.Router();
const WalletTransectionController = require('../controllers/wallet_transection_controller');
const authMiddleware = require('../../authentication/middleware/authMiddleware');


// router.get('/', WalletTransectionController.getTransactionsByTimestampAndDescription);
router.get('/:id',authMiddleware(), WalletTransectionController.getUserTransectionById);
// router.post('/', gameScheduleController.createGameManagement);
router.post('/add/:id',authMiddleware(), WalletTransectionController.addMoney);
router.post('/withdraw/:id',authMiddleware(), WalletTransectionController.withdrawMoney);

module.exports = router;
