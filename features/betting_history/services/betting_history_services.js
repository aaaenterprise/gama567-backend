
const BettingHistory = require('../models/betting_history_model')
const User = require("../../authentication/models/userModel")
const DeclareResult = require('../../admin/declare_result/models/declare_result_model')
const WinningHistory = require('../../admin/winning_history/models/winning_history_model')
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
            // console.log(bettingData);
            bettingData = await BettingHistoryUtils.getCleanBettingData(bettingData)
            // console.log(`bettingData---> ${bettingData}`);
            const currentDate = new Date();
            // console.log(`current time ---->${currentDate}`);
            // Adjust the hours and minutes to match the Kolkata time zone offset
            currentDate.setHours(currentDate.getHours() + 5); // Subtract 5 hours to adjust for Kolkata time zone
            currentDate.setMinutes(currentDate.getMinutes() + 30); // Subtract 30 minutes to adjust for Kolkata time zone

            // Convert the date to ISO string format
            const isoString = currentDate.toISOString();
            // console.log(`current time ---->${isoString}`);





            let declare_result_model = await DeclareResult.findOne({
                gameName: bettingData.gameName,
                timestamp: {
                    $gte: new Date(`${isoString.split("T")[0]}T00:00:00Z`),
                    $lt: new Date(`${isoString.split("T")[0]}T23:59:59Z`),
                }
            });



            if (declare_result_model) {
                if (declare_result_model.openPana && declare_result_model.closePana) {
                    throw new Error("Result already declared")
                }

                bettingData = bettingData.map((betData) => {

                    if (
                        (declare_result_model.openPana && betData.betTime === 'Open') ||
                        (declare_result_model.closePana && betData.betTime === 'Close') ||
                        (declare_result_model.closePana && betData.betTime == '')
                    ) {
                        return false; // Filter out elements based on conditions
                    }
                    return true; // Include elements that do not meet the filtering conditions


                })

            }



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

    // delete betting history by betting id also revert the payment to the user wallet and if user have winn any amount from this bet it will also be deduct from the user wallet

    // async deleteBettingHistoryById(id) {

    //     try {
    //         const betting = await BettingHistory.findById(id)
    //         console.log('====================================');
    //         console.log(betting);
    //         console.log('====================================');
    //         if (!betting) {
    //             throw new Error('betting not found');
    //         }
    //         // find the today declare result of this game
    //         const declare_result_model = await DeclareResult.findOne({
    //             gameName: betting.gameName,
    //             timestamp: {
    //                 $gte: new Date(`${betting.timestamp.split("T")[0]}T00:00:00Z`),
    //                 $lt: new Date(`${betting.timestamp.split("T")[0]}T23:59:59Z`),
    //             }
    //         });

    //         // if result not declare then delete the betting history
    //         if (!declare_result_model) {
    //             await BettingHistory.findByIdAndDelete(id)
    //             const userExist = await User.findById(betting.userId)
    //             userExist.wallet = userExist.wallet + betting.betAmount
    //             await userExist.save()
    //             return
    //         }
    //         if (!declare_result_model.winners.includes(betting.userId)) {
    //             await BettingHistory.findByIdAndDelete(id)
    //             const userExist = await User.findById(betting.userId)
    //             userExist.wallet = userExist.wallet + betting.betAmount
    //             await userExist.save()
    //             return
    //         }

    //         const userExist = await User.findById(betting.userId)

    //         // find winning history of user 
    //         const winning = await WinningHistory.findOne(
    //             {
    //                 userId: betting.userId,
    //                 gameName: betting.gameName,

    //                 timestamp: {
    //                     $gte: new Date(`${betting.timestamp.split("T")[0]}T00:00:00Z`),
    //                     $lt: new Date(`${betting.timestamp.split("T")[0]}T23:59:59Z`),
    //                 }
    //             })

    //         // total deduct from user wallet is 
    //         if (winning) {
    //             userExist.wallet = userExist.wallet - (winning.winAmount - betting.betAmount)
    //             await WinningHistory.findByIdAndDelete(winning._id)
    //         } else {
    //             userExist.wallet = userExist.wallet + betting.betAmount
    //         }
    //         userExist.save()

    //         await BettingHistory.findByIdAndDelete(id)


    //         return

    //     }
    //     catch (error) {
    //         console.log('====================================');
    //         console.log(error);
    //         console.log('====================================');
    //         throw error
    //     }
    // }

    async deleteBettingHistoryById(id) {
        try {
            const betting = await BettingHistory.findById(id);
            console.log('====================================');
            console.log(betting);
            console.log('====================================');
    
            if (!betting) {
                throw new Error('betting not found');
            }
    
            // Convert the Date object to an ISO string for date-only comparison
            const bettingDateString = betting.timestamp.toISOString().split('T')[0];
    
            // find the today declare result of this game
            const declare_result_model = await DeclareResult.findOne({
                gameName: betting.gameName,
                timestamp: {
                    $gte: new Date(`${bettingDateString}T00:00:00Z`),
                    $lt: new Date(`${bettingDateString}T23:59:59Z`),
                }
            });
    
            // if result not declare then delete the betting history
            if (!declare_result_model) {
                await BettingHistory.findByIdAndDelete(id);
                const userExist = await User.findById(betting.userId);
                userExist.wallet = userExist.wallet + betting.betAmount;
                await userExist.save();
                return;
            }
    
            if (!declare_result_model.winners.includes(betting.userId)) {
                await BettingHistory.findByIdAndDelete(id);
                const userExist = await User.findById(betting.userId);
                userExist.wallet = userExist.wallet + betting.betAmount;
                await userExist.save();
                return;
            }
    
            const userExist = await User.findById(betting.userId);
    
            // find winning history of user
            const winning = await WinningHistory.findOne({
                userId: betting.userId,
                gameName: betting.gameName,
                timestamp: {
                    $gte: new Date(`${bettingDateString}T00:00:00Z`),
                    $lt: new Date(`${bettingDateString}T23:59:59Z`),
                }
            });
    
            // total deduct from user wallet is
            if (winning) {
                userExist.wallet = userExist.wallet - (winning.winAmount - betting.betAmount);
                await WinningHistory.findByIdAndDelete(winning._id);
            } else {
                userExist.wallet = userExist.wallet + betting.betAmount;
            }
    
            await userExist.save();
            await BettingHistory.findByIdAndDelete(id);
    
            return;
    
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
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


    async deleteOldBiddingHistory() {
        try {
            // Calculate the date 31 days ago from the current date
            const date31DaysAgo = new Date();
            date31DaysAgo.setDate(date31DaysAgo.getDate() - 31);

            // Delete documents older than 31 days
            const result = await BettingHistory.deleteMany({
                timestamp: { $lt: date31DaysAgo }
            });

            console.log(`Deleted ${result.deletedCount} old Bidding  history records.`);
        } catch (error) {
            console.error('Error deleting old winning history records:', error);
        }
    }

}

module.exports = new BettingHistoryServices;