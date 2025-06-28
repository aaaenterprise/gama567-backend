// features/authentication/routes/authRoutes.js
// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin,validateResendOtp ,validateOtp} = require('../middleware/validations');
const authMiddleware=require('../middleware/authMiddleware')
const router = express.Router();

router.post('/delete-data',  authController.deleteUserData);
router.post('/register', validateRegistration, authController.registerUser);
router.post('/resend-otp',validateResendOtp, authController.resendOtp);
router.post('/login', validateLogin, authController.loginUser);
router.post('/verify-otp',validateOtp, authController.verifyOtp);
router.put('/change-password',authMiddleware(), authController.changePassword);
router.get('/profile',authMiddleware(), authController.getUserByID);
module.exports = router;
