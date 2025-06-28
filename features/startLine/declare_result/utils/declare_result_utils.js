
const User = require('../../../authentication/models/userModel')
// const WalletTransectionServices = require('../../../wallet_management/services/wallet_transection_service')
const WinningHistory = require('../../winning_history/models/winning_history_model')
const WalletTransaction = require('../../../wallet_management/models/wallet_transaction_model')
class DeclareResultUtils {

    async calculateWinningPoints(betType, betAmount, gameRate) {
        switch (betType) {
            case 'Single Digit':
                return betAmount * (gameRate.singleDigit) / 10;

            case 'Single Pana':
                return betAmount * (gameRate.singlePana) / 10;
            case 'Double Pana':
                return betAmount * (gameRate.doublePana) / 10;
            case 'Triple Pana':
                return betAmount * (gameRate.triplePana) / 10;

            default:
                return 0; // Default case for unknown betType
        }
    };




    async createFormattedList(filteredData, gameRate) {
        // console.log(filteredData, gameRate);
        const currentDate = new Date().toISOString(); // Get current date in ISO format

        const result = await Promise.all(filteredData.map(async (item) => {
            const user = await User.findById(item.userId);

            const bidPoints = item.betAmount.toString();
            const winningPoints = await this.calculateWinningPoints(item.betType, item.betAmount, gameRate);
            const bidNumber = item.betNumber;

            const data = {
                betHistoryId: item._id,
                userId: item.userId,
                userName: user.name,
                bidPoints: bidPoints,
                winningPoints: winningPoints,
                betType: item.betType,
                gameName: item.gameName,
               
                bidnumber: bidNumber,
                date: currentDate,
            };

            return data;
        }));


        return result;
    };



    convertPanaToAnk(number) {
        // Convert the number to a string to iterate through each digit
        const digitString = Math.abs(number).toString();

        // Sum all the digits
        const digitSum = digitString.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);

        // Get the last digit of the summation
        const lastDigit = digitSum % 10;

        return lastDigit;
    }


    async createModelList(resultData) {

        return await Promise.all(resultData.map(async (item) => {
            const { userId, gameName, betType, bidPoints, winningPoints, betTime } = item;

            const betAmount = parseInt(bidPoints, 10);
            const winningAmount = parseFloat(winningPoints);
            // await this.addMoneyTouserWallet(userId, winningAmount, betType, gameName);

            return {
                userId,
                gameName: gameName,
                betType,
                betTime,
                betAmount,
                winningAmount,
            };
        }));
    };

    // async addMoneyTouserWallet(userId, amount, betType, gameName) {
    //     // const user = await User.findById(userId);

    //     // user.wallet = user.wallet + amount;
    //     const data = {
    //         "userId": userId,
    //         "amount": amount,

    //         "description": `${betType} ${gameName} winning`
    //     };
    //     // console.log(data);
    //     return await WalletTransectionServices.addMoney(userId, data)
    //     // await user.save()

    // }
    async addWinningAmountToUserWallet(winningData) {

        await Promise.all(winningData.map(async (item) => {
            // const user = await User.findById(item.userId);

            // user.wallet = user.wallet + item.winningAmount;
            const data = {
                "userId": item.userId,
                "amount": item.winningAmount,
                "type": "credit",
                "description": `${item.betType} ${item.gameName} winning`

            };

            const transection = await WalletTransaction(data);
            await transection.save();
            // await WalletTransectionServices.addMoney(item.userId, data)
            // await user.save()



        }));
    };

    async addPointsToUserWallet(data) {
        return Promise.all(data.map(async (item) => {
            const userExist = await User.findById(item.userId)

            userExist.wallet = parseInt(userExist.wallet) + parseInt(item.totalWinning)
            await userExist.save();
        }));
    }
    async withdrawPointsToUserWallet(data) {
        return Promise.all(data.map(async (item) => {
            const userExist = await User.findById(item.userId)

            userExist.wallet = parseInt(userExist.wallet) - parseInt(item.totalWinning)
            await userExist.save();
        }));
    }

    calculateTotalWinning(data) {
        const userWinningMap = {};

        // Calculate total winning for each user
        data.forEach((bet) => {
            if (userWinningMap[bet.userId]) {
                userWinningMap[bet.userId] += bet.winningAmount;
            } else {
                userWinningMap[bet.userId] = bet.winningAmount;
            }
        });

        // Convert userWinningMap to an array of UserWinning objects
        const userWinningList = Object.entries(userWinningMap).map(([userId, totalWinning]) => ({
            userId,
            totalWinning,
        }));

        return userWinningList;
    };


    async withdrawWinningAmountFromUserWallet(winningData) {

        await Promise.all(winningData.map(async (item) => {
            const user = await User.findById(item.userId);

            // user.wallet = user.wallet - item.winningAmount;
            const data = {
                "userId": item.userId,
                "amount": item.winningAmount,
                "type": "debit",
                "description": 'payment withdraw '
            };
            // await WalletTransectionServices.withdrawMoney(item.userId, data)
            const transection = await WalletTransaction(data);
            await transection.save();
            // await user.save()
            await WinningHistory.findByIdAndDelete(item._id);


        }));
    };
}
module.exports = new DeclareResultUtils();