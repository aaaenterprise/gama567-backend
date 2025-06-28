
const BettingHistory = require('../models/betting_history_model')
const User = require("../../../authentication/models/userModel")
// const DeclareResult = require('../../admin/declare_result/models/declare_result_model')
const BettingHistoryUtils = require('../utils/betting_history_utils')
class BettingHistoryServices {

    async getAllBettingHistory(query) {

        try {
            const { timestamp, gameName } = query;
            query = {
                timestamp: {
                    $gte: new Date(`${timestamp}T00:00:00Z`),
                    $lt: new Date(`${timestamp}T23:59:59Z`),

                },
                gameName: gameName
            }

            return await BettingHistory.find(query).populate("userId")
        }
        catch (error) {
            throw error;
        }
    }
    async getBettingHistoryByUserId(id) {

        try {
            return await BettingHistory.find({ userId: id })
        }
        catch (error) {
            throw error;
        }
    }

    async createBettingHistory(userId, bettingData) {

        try {
            if (bettingData.length < 1) {
                throw new Error("Try to add atleast one bet")
            }
            bettingData = await BettingHistoryUtils.getCleanBettingData(bettingData)

            const currentDate = new Date();

            // Adjust the hours and minutes to match the Kolkata time zone offset
            currentDate.setHours(currentDate.getHours() + 5); // Subtract 5 hours to adjust for Kolkata time zone
            currentDate.setMinutes(currentDate.getMinutes() + 30); // Subtract 30 minutes to adjust for Kolkata time zone

            // Convert the date to ISO string format
            const isoString = currentDate.toISOString();






            // let declare_result_model = await DeclareResult.findOne({
            //     gameName: bettingData.gameName,
            //     timestamp: {
            //         $gte: new Date(`${isoString.split("T")[0]}T00:00:00Z`),
            //         $lt: new Date(`${isoString.split("T")[0]}T23:59:59Z`),
            //     }
            // });



            // if (declare_result_model) {
            //     if (declare_result_model.openPana && declare_result_model.closePana) {
            //         throw new Error("Result already declared")
            //     }

            //     bettingData = bettingData.map((betData) => {

            //         if (
            //             (declare_result_model.openPana && betData.betTime === 'Open') ||
            //             (declare_result_model.closePana && betData.betTime === 'Close') ||
            //             (declare_result_model.closePana && betData.betTime == '')
            //         ) {
            //             return false; // Filter out elements based on conditions
            //         }
            //         return true; // Include elements that do not meet the filtering conditions


            //     })

            // }



            for (let i = 0; i < bettingData.length; i++) {
                // Add the currentDateTime field to each object
                bettingData[i].timestamp = isoString;
            }
            // if (declare_result_model.openPana != null && declare_result_model.openPana !== '' && bett)
            const userExist = await User.findById(userId)

            if (!userExist) {
                throw new Error('User not found');
            }
            // Calculate total betAmount
            const totalBetAmount = bettingData.reduce((total, history) => {
                return total + parseInt(history.betAmount);
            }, 0);
            // checking that is user have enough fund
            if (parseInt(userExist.wallet) < totalBetAmount) {
                throw new Error("You don't enough money to complete this bid");
            }
            // console.log(bettingData);

            // deducting
            userExist.wallet = userExist.wallet - totalBetAmount
            userExist.save()
            const betting = await BettingHistory.insertMany(bettingData);
            // console.log(betting);
            return betting


        }
        catch (error) {
            throw error;
        }
    }
    async updateBettingHistory(bettingData) {

        try {
            const userExist = await User.findById(bettingData.userId)
            if (!userExist) {
                throw new Error('User not found');
            }


            let betting = await BettingHistory.findById(bettingData._id != null ? bettingData._id : bettingData.id)

            // case - 1 where betting amount is reduced
            if (betting.betAmount > bettingData.betAmount) {
                userExist.wallet = userExist.wallet + betting.betAmount - bettingData.betAmount
            }
            // case - 1 where betting amount is increased
            else if (betting.betAmount < bettingData.betAmount) {
                userExist.wallet = userExist.wallet + betting.betAmount - bettingData.betAmount
            }
            userExist.save()


            betting = await BettingHistory.findByIdAndUpdate(bettingData._id != null ? bettingData._id : bettingData.id, bettingData, { new: true }).populate("userId")


            return betting
        }
        catch (error) {
            throw error;
        }
    }
    async deleteBettingHistoryByUserId(userId) {

        try {
            const userExist = await User.findById(userId)
            if (!userExist) {
                throw new Error('User not found');
            }


            let betting = await BettingHistory.deleteMany({ userId })


            return betting
        }
        catch (error) {
            throw error;
        }
    }



}

module.exports = new BettingHistoryServices;