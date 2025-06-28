
// features/authentication/routes/authRoutes.js
// routes/authRoutes.js
const express = require('express');
const AdminAuthController = require("../controller/admin_auth_controller")
const adminAuthMiddleware = require('../../validator')
const router = express.Router();

router.post('/register',  AdminAuthController.registerAdmin);

router.post('/login', AdminAuthController.loginAdmin);
router.put('/change-password', adminAuthMiddleware(), AdminAuthController.changeUserPassword);

module.exports = router;

