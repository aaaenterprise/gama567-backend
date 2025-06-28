const express = require('express');
const router = express.Router();
const gameScheduleController = require('../controllers/game_management_controller');

router.put('/rate/:id', gameScheduleController.updateGameRate);
router.get('/rate', gameScheduleController.getGameRate);
router.post('/rate', gameScheduleController.addGameRate);
// Define routes
router.get('/', gameScheduleController.getAllGameManagements);
router.get('/:id', gameScheduleController.getGameManagementById);
router.post('/', gameScheduleController.createGameManagement);
router.put('/:id', gameScheduleController.updateGameManagement);
router.delete('/:id', gameScheduleController.deleteGameManagement);

module.exports = router;
