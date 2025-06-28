
const authService = require('../services/authServices');

const { httpStatusCodes } = require('../../../common/utils')
const { registerUserSchema,
    loginUserSchema,
    ressetPasswordSchema,
    changePasswordSchema,
} = require('../middleware/validations')





exports.deleteUserData = async (req, res, next) => {
    try {



        await authService.deleteUserData(req.body.phone);
        res.status(httpStatusCodes.created).json({ success: true, message: "User data deleted successfully", data: {} });
    } catch (error) {

        next(error);
    }
};
exports.verifyOtp = async (req, res, next) => {
    try {

        const token = await authService.verifyOtp(req.body);
        res.status(httpStatusCodes.ok).json({ success: true, message: "Mobile Number Verified", data: token });
    } catch (error) {

        next(error);
    }
};
exports.registerUser = async (req, res, next) => {
    try {



        const token = await authService.registerUser(req.body);
        res.status(httpStatusCodes.created).json({ success: true, message: "User Registered Successfully , Now Verify Mobile", data: token });
    } catch (error) {

        next(error);
    }
};
exports.resendOtp = async (req, res, next) => {
    try {

        const token = await authService.resendOtp(req.body);
        res.status(httpStatusCodes.created).json({ success: true, message: "OTP Resent Successfully", data: token });    
    } catch (error) {

        next(error);
    }
}

exports.loginUser = async (req, res, next) => {
    try {



        const userData = await authService.loginUser(req.body);
        if (userData instanceof String) {


            res.status(httpStatusCodes.ok).json({ success: false, message: "Mobile Number Is Not Verified", data: { userData } });
        } else {

            res.status(httpStatusCodes.ok).json({ success: true, message: "Successfully loggedIn", data: userData });
        }
    } catch (error) {
        next(error);
    }
};

exports.logoutUser = (req, res) => {
    // Perform any necessary logout actions
    res.status(httpStatusCodes.ok).json({ success: true, message: 'Logged out successfully', data: {} });
};

exports.refreshToken = (req, res, next) => {
    try {
        // Get the user ID from the decoded token attached to the request
        const userId = req.userData.userId;

        // Generate a new token with the same user ID
        const newToken = jwt.sign({ userId }, config.jwtSecret, { expiresIn: '30d' });

        res.status(httpStatusCodes.ok).json({ success: true, message: "Successfully loggedIn", data: newToken });
    } catch (error) {
        next(error);
    }
};


exports.changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id.toString();
        const { oldPassword, newPassword } = req.body;

        await authService.changeUserPassword(userId, oldPassword, newPassword);
        res.status(httpStatusCodes.ok).json({ success: true, message: 'Password changed successfully', data: {} });
    } catch (error) {
        next(error);
    }
};
exports.sendOTP = async (req, res, next) => {



    try {

        const email_to = req.body.email;
        // console.log(email_to);
        const response = await authService.sendOTP(email_to);

        res.status(httpStatusCodes.ok).json({ success: true, message: 'Otp sent to your mail, verify it it order to ', data: response });
    } catch (error) {
        next(error);
    }
};
exports.ressetPassword = async (req, res, next) => {



    try {
        const validatedData = await ressetPasswordSchema.validateAsync(req.body)
        // console.log(validatedData);
        await authService.ressetPassword(validatedData);

        res.status(httpStatusCodes.ok).json({ success: true, message: 'You have resset your password successfully ', data: {} });
    } catch (error) {
        next(error);
    }
};
exports.getUserByID = async (req, res, next) => {



    try {
        // const validatedData = await ressetPasswordSchema.validateAsync(req.body)
        // // console.log(validatedData);
        // await authService.ressetPassword(validatedData);

        res.status(httpStatusCodes.ok).json({ success: true, message: 'user profile', data: req.user });
    } catch (error) {
        next(error);
    }
};
