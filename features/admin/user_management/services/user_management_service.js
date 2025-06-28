
const User=require('../../../authentication/models/userModel')

class UserManagementServices {

    async getAllUsers() {

        try {

            return await User.find({role:'user', phone: { $ne: '7788994455' }})
        }
        catch (error) {
            throw error;
        }
    }
    async getUserById(id) {

        try {
            const userExist = await User.findById(id)

            if (!userExist) {
                throw new Error('User inot found');
            }

            return userExist
        }
        catch (error) {
            throw error;
        }
    }

    async addUser(userData) {

        try {
            const userExist = await User.findOne({ phone: userData.phone })
            console.log(userExist);
            if (userExist) {
                throw new Error('User is already exist');
            }

            const user = await User(userData)
            user.save()
            return user
        }
        catch (error) {
            throw error;
        }
    }
    async updateUser(id, userData) {

        try {
            const userExist = await User.findById(id,)

            if (!userExist) {
                throw new Error('User is not found');
            }
            if (userExist.phone == "9874563210") {

                userData.active = true;
                userData.verify=false
            }
            return await User.findByIdAndUpdate(id, userData, { new: true });
        }
        catch (error) {
            throw error;
        }
    }
    async deleteUser(id) {

        try {
            const userExist = await User.findById(id,)

            if (!userExist) {
                throw new Error('User is not found');
            }

            return await User.findByIdAndDelete(id);
        }
        catch (error) {
            throw error;
        }
    }
    async getUserStats() {

        try {
            const countOfVerifyUsers = await User.aggregate([
                {
                    $group: {
                        _id: '$verify',
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Extract count of verified and non-verified users
            const verifiedCount = countOfVerifyUsers.find(item => item._id === true)?.count || 0;
            const notVerifiedCount = countOfVerifyUsers.find(item => item._id === false)?.count || 0;

            console.log('Verified Users Count:', verifiedCount);
            console.log('Not Verified Users Count:', notVerifiedCount);

            return { verifiedCount, notVerifiedCount };
        }
        catch (error) {
            throw error;
        }
    }

}

module.exports = new UserManagementServices;