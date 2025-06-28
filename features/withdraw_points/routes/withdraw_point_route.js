const express = require('express');
const router = express.Router();
const WithdrawPointController = require('../controllers/withdraw_point_controller');
const authMiddleware = require('../../authentication/middleware/authMiddleware');



// router.post('/', gameScheduleController.createGameManagement);
router.post('/', authMiddleware(), WithdrawPointController.createWithdrawRequest);
router.get('/',  WithdrawPointController.getAllWithdrawRequest);
router.put('/',  WithdrawPointController.updateWithdrawRequest);


module.exports = router;
