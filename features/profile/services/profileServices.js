// features/user/controllers/profileServices.js

const User = require('../../authentication/models/userModel');

class ProfileService {

    async getUserByUserId(userId) {
        try {
            const userProfile = await User.findById({ userId }).select("-password")
            if(!userProfile0){
                throw new Error("User Not Found")
            }

            return userProfile;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ProfileService();

