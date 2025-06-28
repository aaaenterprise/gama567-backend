

const jwt = require('jsonwebtoken');
const config = require('../../../config/appConfig');
const mailConfig = require('../../../config/mailConfig');
const User = require('../models/userModel');

const EmailSender = require('../../../common/send_mail');
const { sendOTP } = require('../../../common/send-otp-sms');
const generateOTP = require('../../../common/generate_otp');
const Settings = require('../../admin/settings/models/setting_model');
const WalletTransectionServices = require('../../wallet_management/services/wallet_transection_service');
const BettingHistoryServices = require('../../betting_history/services/betting_history_services');
const WinningHistoryService = require('../../admin/winning_history/services/winning_history_service');

// Helper function to generate token response in the specified format
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, config.jwtSecret, { expiresIn: '9999999d' });
  const refreshToken = jwt.sign({ userId, role, tokenType: 'refresh' }, config.jwtSecret, { expiresIn: '9999999999d' });
  
  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now in milliseconds
  };
};

exports.deleteUserData = async (phone) => {
  const user = await User.findOne({ phone: phone });
  if (!user) {
    throw new Error("User Not Found");
  }
  
  if (user.phone !== "9874563210") {
    user.active = false;
  }
  user.save();
  return "User Deleted successfully";
};

exports.registerUser = async (userData) => {
  try {
    const { name, phone, password } = userData;

    const existingUser = await User.findOne({ phone: phone });
    if (existingUser) {
      if (existingUser.isMobileVerified) {
        throw new Error('Phone number already in use');
      }
      const otp = generateOTP.generateOTP();
      console.log(`otp--->${otp}`);
      sendOTP(otp, phone);
      const token = jwt.sign({ otp: otp, userId: existingUser._id }, mailConfig.email_jwt_key, { expiresIn: '10m' });

      return { token };
    }

    const newUser = new User({ name, phone, password, role: 'user' });
    const setting = await Settings.findOne({});
    newUser.verify = setting.autoVerify;
    newUser.wallet = 0;

    newUser.isMobileVerified = false;
    await newUser.save();
    
    const otp = generateOTP.generateOTP();
    console.log(`otp--->${otp}`);
    sendOTP(otp, phone);
    const token = jwt.sign({ otp: otp, userId: newUser._id }, mailConfig.email_jwt_key, { expiresIn: '10m' });

    return { token };
  } catch (error) {
    throw error;
  }
};

exports.verifyOtp = async (userData) => {
  try {
    const decodedToken = jwt.verify(userData.token, mailConfig.email_jwt_key);
    if (decodedToken['otp'] != userData.otp) {
      throw new Error('Invalid OTP');
    }
    
    let user = await User.findById(decodedToken['userId']);
    if (!user) {
      throw new Error("Invalid OTP");
    }
    
    user.isMobileVerified = true;
    await user.save();
    
    const { password, ...userDataWithoutPassword } = user.toJSON();
    
    // Generate tokens in the specified format
    const tokens = generateTokens(user._id, user.role);

    return {
      ...userDataWithoutPassword,
      tokens
    };
  } catch (error) {
    throw error;
  }
};

exports.resendOtp = async (phone) => {
  try {
    const user = await User.findOne({ phone: phone });
    if (!user) {
      throw new Error("User Not Found");
    }
    
    const otp = generateOTP.generateOTP();
    console.log(`otp--->${otp}`);
    sendOTP(otp, phone);
    const token = jwt.sign({ otp: otp, userId: user._id }, mailConfig.email_jwt_key, { expiresIn: '10m' });

    return token;
  } catch (error) {
    throw error;
  }
};

exports.loginUser = async (loginData) => {
  try {
    const { phone, password } = loginData;

    // Find the user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    if (!user.active) {
      throw new Error("Invalid User");
    }
    if (!user.isMobileVerified) {
        const otp = generateOTP.generateOTP()
        console.log(`otp--->${otp}`);
        sendOTP(otp, phone)
        const token = jwt.sign({ otp: otp, userId: user._id }, mailConfig.email_jwt_key, { expiresIn: '10m' });

        return token
    }
    
    const { password: passwordField, ...userDataWithoutPassword } = user.toJSON();

    // Generate tokens in the specified format
    const tokens = generateTokens(user._id, user.role);

    return {
      ...userDataWithoutPassword,
      tokens
    };
  } catch (error) {
    throw error;
  }
};

exports.refreshToken = async (refreshToken) => {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, config.jwtSecret);
    
    // Check if it's a refresh token
    if (!decoded.tokenType || decoded.tokenType !== 'refresh') {
      throw new Error('Invalid refresh token');
    }
    
    const user = await User.findById(decoded.userId);
    if (!user || !user.active) {
      throw new Error('User not found or inactive');
    }
    
    // Generate new tokens
    return generateTokens(user._id, user.role);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

exports.changeUserPassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error('Invalid old password');
    }

    const isPasswordSame = await user.comparePassword(newPassword);
    if (isPasswordSame) {
      throw new Error('Old password and new password must be different');
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();
    
    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    throw error;
  }
};

exports.resetPassword = async (userData) => {
  try {
    const user = await User.findOne({ phone: userData.phone });
    if (!user) {
      throw new Error('Phone number is not registered with us, try to create a new account');
    }

    const decodedToken = jwt.verify(userData.token, mailConfig.email_jwt_key);

    if (decodedToken['otp'] != userData.otp) {
      throw new Error('Invalid OTP');
    }

    if (decodedToken['password'] != user.password) {
      throw new Error('Password already reset');
    }

    // Update the user's password
    user.password = userData.password;
    await user.save();
    
    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    throw error;
  }
};

exports.sendOTP = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Email is not registered with us, try to create a new account');
    }

    const otp = generateOTP.generateOTP();

    const emailSender = new EmailSender();
    await emailSender.sendEmail(email, user.username, otp);

    const token = jwt.sign({ otp: otp, password: user.password }, mailConfig.email_jwt_key, { expiresIn: '10m' });

    return { token };
  } catch (error) {
    throw error;
  }
};