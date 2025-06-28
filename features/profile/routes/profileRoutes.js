// features/user/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../authentication/middleware/authMiddleware');
const profileController = require('../controllers/profileController');

// Get user's profile
router.get('/', authMiddleware(), profileController.getUserById);


module.exports = router;
