const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/setting_controller');


// Define routes
router.get('/', SettingsController.getSetting);
router.post('/', SettingsController.createSettings);

// router.post('/', gameScheduleController.createGameManagement);
router.put('/', SettingsController.updateSetting);
// router.delete('/:id', gameScheduleController.deleteGameManagement);

module.exports = router;
