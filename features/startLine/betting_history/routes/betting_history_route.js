const express = require('express');
const router = express.Router();
const BettingHistoryController = require('../controllers/betting_history_controller');
const authMiddleware = require('../../../authentication/middleware/authMiddleware');


router.get('/:userId',  BettingHistoryController.getBettingHistoryByUserId);
// router.post('/', gameScheduleController.createGameManagement);
router.post('/',  BettingHistoryController.createBettingHistory);
// router.post('/withdraw/:id', authMiddleware(), WalletTransectionController.withdrawMoney);

module.exports = router;
