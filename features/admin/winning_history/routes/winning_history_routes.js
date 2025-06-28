const express = require('express');
const router = express.Router();
const WinningHistoryController = require('../controller/winning_history_controller');

const authMiddleware = require('../../../authentication/middleware/authMiddleware')
// Define routes
router.get('/:userId',  WinningHistoryController.getWinningHistoryByUserId);


router.post('/', WinningHistoryController.getWinningHistory);

// router.put('/:id', SettingsController.updateSetting);
// router.delete('/:id', gameScheduleController.deleteGameManagement);

module.exports = router;
