const express = require('express');
const router = express.Router();
const UserManagementController = require('../controllers/user_management_controller');


// Define routes
router.get('/states/', UserManagementController.getUserStats);
router.get('/', UserManagementController.getAllUsers);
router.get('/:id', UserManagementController.getUserById);
// router.post('/', gameScheduleController.createGameManagement);
router.put('/:id', UserManagementController.updateUser);
router.delete('/:id', UserManagementController.deleteUser);

module.exports = router;
