
const WithdrawPoint = require('../models/withdraw_point_model')
const User = require("../../authentication/models/userModel")
const TransectionService = require('../../wallet_management/services/wallet_transection_service')
class WithdrawPointServices {

    async getAllWithdrawRequest(query) {

        try {
            const { timestamp } = query;
            query = {
                timestamp: {
                    $gte: new Date(`${timestamp}T00:00:00Z`),
                    $lt: new Date(`${timestamp}T23:59:59Z`),

                },

            }
            // console.log(query);
            return await WithdrawPoint.find(query).populate("userId")
        }
        catch (error) {
            throw error;
        }
    }
    async getAllWithdrawRequestByUserId(userId) {

        try {

            return await WithdrawPoint.find({ userId }).populate("userId")
        }
        catch (error) {
            throw error;
        }
    }

    async createWithdrawRequest(withdrawRequestData) {

        try {
            // console.log(withdrawRequestData)
            const userExist = await User.findById(withdrawRequestData.userId)
            if (!userExist) {
                throw new Error('User not found');
            }
            console.log(userExist);
            if (withdrawRequestData.amount == null || withdrawRequestData.amount <= 0) {
                throw new Error('Invalid Transaction');
            }

            if (parseInt(withdrawRequestData.amount) > parseInt(userExist.wallet)) {
                throw new Error("You don't have enough points")
            }
            const reqData = {
                "userId": withdrawRequestData.userId,
                "amount": withdrawRequestData.amount,
                "description": "Your have withdrawn"
            }
            const currentDate = new Date();

            // Adjust the hours and minutes to match the Kolkata time zone offset
            currentDate.setHours(currentDate.getHours() + 5); // Subtract 5 hours to adjust for Kolkata time zone
            currentDate.setMinutes(currentDate.getMinutes() + 30); // Subtract 30 minutes to adjust for Kolkata time zone

            // Convert the date to ISO string format
            const isoString = currentDate.toISOString();

            const data = await TransectionService.withdrawMoney(withdrawRequestData.userId, reqData)
            const withdraw_point = await WithdrawPoint(withdrawRequestData)
            withdraw_point.timestamp = isoString;
            await withdraw_point.save()
            return withdraw_point
            // const user = await User(userData)
            // user.save()
            // return user
        }
        catch (error) {
            throw error;
        }
    }
    async updateWithdrawRequest(withdrawRequestData) {

        try {

            withdrawRequestData.userId = withdrawRequestData.userId.id
            if (withdrawRequestData.status == 'Rejected') {


                const reqData = {
                    "userId": withdrawRequestData.userId,
                    "amount": withdrawRequestData.amount,
                    "description": "Your withdraw request rejected"
                }

                const data = await TransectionService.addMoney(withdrawRequestData.userId, reqData)

            }



            const updatedData = await WithdrawPoint.findByIdAndUpdate(withdrawRequestData._id, withdrawRequestData, { new: true }).populate("userId")
            return updatedData
        }
        catch (error) {
            throw error;
        }
    }

    async deleteOldTransactionHistory() {
        try {
            // Calculate the date 31 days ago from the current date
            const date31DaysAgo = new Date();
            date31DaysAgo.setDate(date31DaysAgo.getDate() - 31);

            // Delete documents older than 31 days
            const result = await WithdrawPoint.deleteMany({
                timestamp: { $lt: date31DaysAgo }
            });

            console.log(`Deleted ${result.deletedCount} old Transaction  history records.`);
        } catch (error) {
            console.error('Error deleting old winning history records:', error);
        }
    }

}

module.exports = new WithdrawPointServices;