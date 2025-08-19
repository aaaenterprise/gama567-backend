
const WalletTransaction = require('../models/wallet_transaction_model')
const User = require("../../authentication/models/userModel")

const SettingModel = require('../../admin/settings/models/setting_model')
class WalletTransectionServices {


    async getWalletTransectionById(id) {

        try {


            return await WalletTransaction.find({ userId: id })
        }
        catch (error) {
            throw error;
        }
    }

    async getTransactionsByTimestampAndDescription(timestamp) {
        try {



            // Query transactions based on timestamp and description
            const transactions = await WalletTransaction.find({
                timestamp: {
                    $gte: new Date(`${timestamp}T00:00:00Z`),
                    $lt: new Date(`${timestamp}T23:59:59Z`),

                },

                type: "credit",
                description: {
                    $not: {
                        $regex: /winning|Your withdraw request rejected/i
                    }
                }
            }).populate("userId");

            // console.log('Transactions:', transactions);
            return transactions;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    async addMoney(id, transectionData) {

        try {
            const userExist = await User.findById(id)
            if (!userExist) {
                throw new Error('User not found');
            }
            // if (transectionData.amount == null || transectionData.amount<=0){
            //     throw new Error('Invalid Transaction');
            // }
            // const setting = await SettingModel.findOne({})
            // if (transectionData.description === "You have added this money" && parseInt(transectionData.amount) < parseInt(setting.minimumDeposit)) {
            //     throw new Error(`minimum deposit is ${setting.minimumDeposit}`)
            // }

            userExist.wallet = parseInt(userExist.wallet) + parseInt(transectionData.amount)
            const user = await User.findByIdAndUpdate(id, userExist, { new: true });
            const currentDate = new Date();

            // Adjust the hours and minutes to match the Kolkata time zone offset
            currentDate.setHours(currentDate.getHours() + 5); // Subtract 5 hours to adjust for Kolkata time zone
            currentDate.setMinutes(currentDate.getMinutes() + 30); // Subtract 30 minutes to adjust for Kolkata time zone

            // Convert the date to ISO string format
            const isoString = currentDate.toISOString();

            const transection = await WalletTransaction(transectionData);
            transection.type = 'credit'
            transection.timestamp = isoString;
            transection.save();
            return transection
            // const user = await User(userData)
            // user.save()
            // return user
        }
        catch (error) {
            throw error;
        }
    }
     async addMoneyByMobile(phone, transectionData) {

        try {
            const userExist = await User.findOne({ phone })
            if (!userExist) {
                throw new Error('User not found');
            }

            console.log({ userExist });

            userExist.wallet = parseInt(userExist.wallet) + parseInt(transectionData.amount)
            const user = await User.findByIdAndUpdate(userExist._id, userExist, { new: true });
            const currentDate = new Date();

            // Adjust the hours and minutes to match the Kolkata time zone offset
            currentDate.setHours(currentDate.getHours() + 5); // Subtract 5 hours to adjust for Kolkata time zone
            currentDate.setMinutes(currentDate.getMinutes() + 30); // Subtract 30 minutes to adjust for Kolkata time zone

            // Convert the date to ISO string format
            const isoString = currentDate.toISOString();
            transectionData.userId = userExist._id


            const transection = await WalletTransaction(transectionData);
            transection.type = 'credit'
            transection.timestamp = isoString;
            transection.save();
            return transection
            // const user = await User(userData)
            // user.save()
            // return user
        }
        catch (error) {
            throw error;
        }
    }
    async withdrawMoney(id, transectionData) {

        try {
            const userExist = await User.findById(id)
            if (!userExist) {
                throw new Error('User not found');
            }

            const currentDate = new Date();

            // Adjust the hours and minutes to match the Kolkata time zone offset
            currentDate.setHours(currentDate.getHours() + 5); // Subtract 5 hours to adjust for Kolkata time zone
            currentDate.setMinutes(currentDate.getMinutes() + 30); // Subtract 30 minutes to adjust for Kolkata time zone

            // Convert the date to ISO string format
            const isoString = currentDate.toISOString();


            userExist.wallet = parseInt(userExist.wallet) - parseInt(transectionData.amount)

            await userExist.save()
            const transection = await WalletTransaction(transectionData);
            transection.type = 'debit'
            transection.timestamp = isoString
            transection.save();
            return transection

        }
        catch (error) {
            throw error;
        }
    }
    async deleteTransactionByUserId(userId) {

        try {
            const userExist = await User.findById(userId)
            if (!userExist) {
                throw new Error('User not found');
            }

            await WalletTransaction.deleteMany({ userId })

        }
        catch (error) {
            throw error;
        }
    }
    async deleteOldWalletHistory() {
        try {
            // Calculate the date 31 days ago from the current date
            const date31DaysAgo = new Date();
            date31DaysAgo.setDate(date31DaysAgo.getDate() - 180);

            // Delete documents older than 31 days
            const result = await WalletTransaction.deleteMany({
                timestamp: { $lt: date31DaysAgo }
            });

            console.log(`Deleted ${result.deletedCount} old Wallet  history records.`);
        } catch (error) {
            console.error('Error deleting old winning history records:', error);
        }
    }

}

module.exports = new WalletTransectionServices;