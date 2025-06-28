const AdminUser = require('../models/admin_model')
const jwt = require('jsonwebtoken');
const config = require('../../../../config/appConfig'); // Import your configuration
class AdminAuthService {

    async registerAdmin(userData) {


        try {

            const { name, email, password, } = userData;
            const existingAdminUser = await AdminUser.findOne({ email });
            if (existingAdminUser) {
                throw new Error('email  already in use');

            }

            const newAdminUser = new AdminUser({ name, email, password });
            await newAdminUser.save();

            return ({ message: 'Admin registered successfully' });


        } catch (error) {
            throw error;
        }
    }


    async loginAdmin(loginData) {
        try {

            const { email, password } = loginData;

            // Find the user by email
            const user = await AdminUser.findOne({ email });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isPasswordValid = await user.comparePassword(password)
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }


            const { password2, ...otherAdminUserdata } = user._doc;

            // Create and return a JWT token
            const token = jwt.sign({ userId: user._id,  }, config.jwtSecret, { expiresIn: '7d' });

            var data = {

                ...otherAdminUserdata, 'token': token
            };
            return data;
        } catch (error) {
            throw error;
        }
    }
    async changeUserPassword(userId, oldPassword, newPassword) {
        try {


            const user = await AdminUser.findById(userId);
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
        }
        catch (error) {
            throw error
        }
    }
}

module.exports = new AdminAuthService();