const DeclareResult = require('../models/declare_result_model')
const BettingHistory = require('../../../betting_history/models/betting_history_model')
const GameRate = require('../../game_management/models/game_rate_model')
const GameManagement = require('../../game_management/models/game_management_models')
const User = require('../../../authentication/models/userModel')
const DeclareResultUtils = require('../utils/declare_result_utils')
const WinningHistory = require('../../winning_history/models/winning_history_model')
const FirebaseNotificationService = require('../../../../common/notification');
const notificationService = new FirebaseNotificationService();
class DeclareResultService {




    // this is for preview the winner not saving in the database
    async createResult(queryData) {
        try {
            const game_rate_model = await GameRate.findOne({});
            const declare_result_model = await DeclareResult.findOne({
                gameName: queryData.gameName, timestamp: {
                    $gte: new Date(`${queryData.timestamp}T00:00:00Z`),
                    $lt: new Date(`${queryData.timestamp}T23:59:59Z`),
                }
            })
            // let game_management = await GameManagement.findOne({ gameName: queryData.gameName })
            if (declare_result_model && declare_result_model.openPana && declare_result_model.closePana) {
                throw new Error("Result alredy declared for this game")
            }
            // first time declaring result
            if (!declare_result_model) {

                // declaring result for Single digit , Single , Double, Triple Pana,
                // return betting_history
                const { timestamp, gameName, betTime, pana, ank } = queryData;

                const query = {
                    timestamp: {
                        $gte: new Date(`${timestamp}T00:00:00Z`),
                        $lt: new Date(`${timestamp}T23:59:59Z`),
                    },
                    gameName,
                    betType: {
                        $in: ["Single Digit",
                            "Single Pana",
                            "Double Pana",
                            "Triple Pana"]
                    },
                    betTime,
                    $or: [
                        { 'betNumber': pana },
                        { 'betNumber': ank },
                    ],
                };

                const result = await BettingHistory.find(query);
                const data = await DeclareResultUtils.createFormattedList(result, game_rate_model)

                return data;
            }
            else {

                const { timestamp, gameName, betTime, pana, ank } = queryData;
                let resultSDP;
                let resultJodi;
                let resultSangam;
                // if Open session result declared
                if (declare_result_model.openPana != null && declare_result_model.openPana !== '') {
                    // getting result for Single digit , Single , Double, Triple Pana,


                    if (betTime == 'Open') {
                        throw new Error("Result alredy declared for the Open Seccion")
                    }

                    const querySDP = {
                        timestamp: {
                            $gte: new Date(`${timestamp}T00:00:00Z`),
                            $lt: new Date(`${timestamp}T23:59:59Z`),
                        },
                        gameName,
                        betTime: "Close",
                        betType: {
                            $in: ["Single Digit",
                                "Single Pana",
                                "Double Pana",
                                "Triple Pana"]
                        },
                        $or: [
                            { 'betNumber': pana },
                            { 'betNumber': ank },
                        ],
                    };

                    resultSDP = await BettingHistory.find(querySDP);
                    // const data = await DeclareResultUtils.createFormattedList(result, game_rate_model)


                    // getting result for jodi Digit
                    const queryJodi = {
                        timestamp: {
                            $gte: new Date(`${timestamp}T00:00:00Z`),
                            $lt: new Date(`${timestamp}T23:59:59Z`),
                        },
                        gameName,
                        $or: [
                            { betTime: null },
                            { betTime: "" },

                        ],
                        "betNumber.0": `${DeclareResultUtils.convertPanaToAnk(declare_result_model.openPana).toString()}${ank}`,
                        // $expr: {
                        //     $and: [
                        //         { $eq: [{ $arrayElemAt: ["$betNumber", 0] }, DeclareResultUtils.convertPanaToAnk(declare_result_model.openPana).toString()] },
                        //         { $eq: [{ $arrayElemAt: ["$betNumber", 1] }, ank] }
                        //     ]
                        // }
                        // betNumber: { $all: [DeclareResultUtils.convertPanaToAnk(declare_result_model.openPana), ank], },
                    };

                    resultJodi = await BettingHistory.find(queryJodi);
                    // getting result for  samgam
                    const querySangam = {
                        timestamp: {
                            $gte: new Date(`${timestamp}T00:00:00Z`),
                            $lt: new Date(`${timestamp}T23:59:59Z`),
                        },
                        gameName,
                        $or: [
                            { betTime: null },
                            { betTime: "" },

                        ],

                        $expr: {
                            $or: [
                                { //full sangam
                                    $and: [
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 0] }, declare_result_model.openPana] },
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 1] }, pana] }
                                    ]
                                },
                                {// half sangam pana, ank
                                    $and: [
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 0] }, declare_result_model.openPana] },
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 1] }, ank] }
                                    ]
                                },
                                { // half sangam ank, pana
                                    $and: [
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 0] }, DeclareResultUtils.convertPanaToAnk(declare_result_model.openPana).toString()] },
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 1] }, pana] }
                                    ]
                                }
                            ]
                        }

                    };

                    resultSangam = await BettingHistory.find(querySangam);
                    console.log(resultSangam);
                    const data = await DeclareResultUtils.createFormattedList([...resultSDP, ...resultJodi, ...resultSangam], game_rate_model)
                    return data;
                }
                else {

                    if (betTime == 'Close') {
                        throw new Error("Result alredy declared for the Close Seccion")
                    }

                    const querySDP = {
                        timestamp: {
                            $gte: new Date(`${timestamp}T00:00:00Z`),
                            $lt: new Date(`${timestamp}T23:59:59Z`),
                        },
                        gameName,
                        betTime: "Open",
 betType: {
                        $in: ["Single Digit",
                            "Single Pana",
                            "Double Pana",
                            "Triple Pana"]
                    },
                        $or: [
                            { 'betNumber': pana },
                            { 'betNumber': ank },
                        ],
                    };

                    resultSDP = await BettingHistory.find(querySDP);


                    // getting result for jodi Digit
                    const queryJodi = {
                        timestamp: {
                            $gte: new Date(`${timestamp}T00:00:00Z`),
                            $lt: new Date(`${timestamp}T23:59:59Z`),
                        },
                        gameName,
                        $or: [
                            { betTime: null },
                            { betTime: "" },

                        ],
                        $expr: {
                            $and: [
                                { $eq: [{ $arrayElemAt: ["$betNumber", 0] }, ank] },
                                { $eq: [{ $arrayElemAt: ["$betNumber", 1] }, DeclareResultUtils.convertPanaToAnk(declare_result_model.closePana).toString()] }
                            ]
                        }

                        // betNumber: { $all: [ank, DeclareResultUtils.convertPanaToAnk(declare_result_model.closePana)], },
                    };
                    console.log(queryJodi);

                    resultJodi = await BettingHistory.find(queryJodi);

                    // getting result for  samgam
                    const querySangam = {
                        timestamp: {
                            $gte: new Date(`${timestamp}T00:00:00Z`),
                            $lt: new Date(`${timestamp}T23:59:59Z`),
                        },
                        gameName,
                        $or: [
                            { betTime: null },
                            { betTime: "" },

                        ],
                        // $or: [
                        //     { betNumber: { $all: [pana, declare_result_model.closePana], }, },// full sangam
                        //     { betNumber: { $all: [ank, declare_result_model.closePana], }, }, // half sangam ank,pana
                        //     { betNumber: { $all: [pana, DeclareResultUtils.convertPanaToAnk(declare_result_model.closePana)], }, }, // half sangam  pana, ank


                        // ],
                        $expr: {
                            $or: [
                                { //full sangam
                                    $and: [
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 0] }, pana] },
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 1] }, declare_result_model.closePana] }
                                    ]
                                },
                                {// half sangam pana, ank
                                    $and: [
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 0] }, pana] },
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 1] }, DeclareResultUtils.convertPanaToAnk(declare_result_model.closePana).toString()] }
                                    ]
                                },
                                { // half sangam ank, pana
                                    $and: [
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 0] }, ank] },
                                        { $eq: [{ $arrayElemAt: ["$betNumber", 1] }, declare_result_model.closePana] }
                                    ]
                                }
                            ]
                        }

                    };

                    resultSangam = await BettingHistory.find(querySangam);

                    const data = await DeclareResultUtils.createFormattedList([...resultSDP, ...resultJodi, ...resultSangam], game_rate_model)
                    return data;
                }

            }


        } catch (error) {
            throw error;
        }
    }
    // this is for save the result in the database
    async declareResult(resultData, queryData) {
        try {
            let declare_result_model = await DeclareResult.findOne({
                gameName: queryData.gameName, timestamp: {
                    $gte: new Date(`${queryData.timestamp}T00:00:00Z`),
                    $lt: new Date(`${queryData.timestamp}T23:59:59Z`),
                }
            });
            if (declare_result_model && declare_result_model.openPana && declare_result_model.closePana) {
                throw new Error("Result alredy declared for this game")
            }

            // let game_management = await GameManagement.findOne({ gameName: queryData.gameName })
            // if result not exist
            if (!declare_result_model) {
                // adding data to winning history model
                let winning_history_data = await DeclareResultUtils.createModelList(resultData);
                console.log(winning_history_data);
                let winningHistory = await WinningHistory.insertMany(winning_history_data)
                const totalWinningByUser = DeclareResultUtils.calculateTotalWinning(winningHistory);
                await DeclareResultUtils.addPointsToUserWallet(totalWinningByUser)
                // adding Winning amount to the user wallet
                await DeclareResultUtils.addWinningAmountToUserWallet(winningHistory);

                // preparing data to save declare result
                let declareResultData = {
                    "gameName": queryData.gameName,
                    "openPana": "",
                    "closePana": "",
                    "timestamp": queryData.timestamp
                }
                if (queryData.betTime == "Open") {
                    declareResultData['openPana'] = queryData.pana;
                } else {
                    declareResultData['closePana'] = queryData.pana;
                }
                // adding winniers
                declareResultData.winners = winningHistory.map((element) => element._id)
                // saving data
                const declare_result = await DeclareResult(declareResultData)
                declare_result.save();
                // notificationService.sendToTopic( "Result Declared for " + queryData.gameName, " Result Declared " +queryData.betTime + " Pana is " + queryData.pana);
                return declare_result;
            }

            // if result exist and declared for open session
            if (declare_result_model.openPana != null && declare_result_model.openPana !== '') {

                console.log("close --->1");
                // adding data to winning history model

                let winning_history_data = await DeclareResultUtils.createModelList(resultData);

                let winningHistory = await WinningHistory.insertMany(winning_history_data)
                const totalWinningByUser = DeclareResultUtils.calculateTotalWinning(winningHistory);
                await DeclareResultUtils.addPointsToUserWallet(totalWinningByUser)
                // adding winning amount to the user wallet
                await DeclareResultUtils.addWinningAmountToUserWallet(winningHistory);

                // Updating declare result
                declare_result_model.closePana = queryData.pana
                winningHistory.map((winner) => {
                    declare_result_model.winners.push(winner._id);
                })
                declare_result_model.save()

                // notificationService.sendToTopic( "Result Declared for " + queryData.gameName, " Result Declared " +queryData.betTime + " Pana is " + queryData.pana);
                return declare_result_model;
            } else {
                console.log("close --->2");
                // adding data to winning history model
                let winning_history_data = await DeclareResultUtils.createModelList(resultData);
                let winningHistory = await WinningHistory.insertMany(winning_history_data)

                const totalWinningByUser = DeclareResultUtils.calculateTotalWinning(winningHistory);
                await DeclareResultUtils.addPointsToUserWallet(totalWinningByUser)
                // adding winning amount to the user wallet
                await DeclareResultUtils.addWinningAmountToUserWallet(winningHistory);

                // Updating declare result
                declare_result_model.openPana = queryData.pana
                winningHistory.map((winner) => {
                    declare_result_model.winners.push(winner._id);
                })
                declare_result_model.save()

                // notificationService.sendToTopic( "Result Declared for " + queryData.gameName, " Result Declared " +queryData.betTime + " Pana is " + queryData.pana);
                return declare_result_model;
            }

        } catch (error) {
            throw error;
        }
    }

    async getDeclaredResult(queryData) {

        const { timestamp } = queryData;
        try {
            const result = await DeclareResult.find({
                timestamp: {
                    $gte: new Date(`${timestamp}T00:00:00Z`),
                    $lt: new Date(`${timestamp}T23:59:59Z`),
                }
            })

            return result
        }
        catch (err) {
            throw err
        }

    }
    async getDeclaredResultByGameName({ gameName }) {


        try {
            const result = await DeclareResult.find({
                gameName
            })

            return result
        }
        catch (err) {
            throw err
        }

    }
    async deleteDeclaredResultById(id, session) {


        try {
            let result = await DeclareResult.findOne({ _id: id }).populate('winners');
            if (!result) {
                throw new Error("Result not found")
            }

            if (result.openPana == '' || result.closePana == '') {

                if (result.openPana == '' && session === "Open") {
                    throw new Error("Open session result already deleted")
                } else if (result.closePana == '' && session === "Close") {
                    throw new Error("Close session result already deleted")
                }
                const winnerList = result.winners.filter((winner) => winner.betTime == session)
                const data2 = DeclareResultUtils.calculateTotalWinning(winnerList)
                console.log(winnerList);
                await DeclareResultUtils.withdrawPointsToUserWallet(data2)
                await DeclareResultUtils.withdrawWinningAmountFromUserWallet(winnerList)
                result = await DeclareResult.findByIdAndDelete(id)
            } else {
                if (session === 'Open') {
                    const winnerList = result.winners.filter((winner) => winner.betTime == session || winner.betTime == '' || winner.betTime == null)
                    const data2 = DeclareResultUtils.calculateTotalWinning(winnerList)
                    console.log(winnerList);
                    await DeclareResultUtils.withdrawPointsToUserWallet(data2)
                    await DeclareResultUtils.withdrawWinningAmountFromUserWallet(winnerList)
                    let data = result
                    data.openPana = ''
                    result = await DeclareResult.findByIdAndUpdate(id, data, { new: true })
                } else if (session === 'Close') {
                    const winnerList = result.winners.filter((winner) => winner.betTime == session || winner.betTime == '' || winner.betTime == null)
                    console.log(winnerList);
                    const data2 = DeclareResultUtils.calculateTotalWinning(winnerList)
                    await DeclareResultUtils.withdrawPointsToUserWallet(data2)
                    await DeclareResultUtils.withdrawWinningAmountFromUserWallet(winnerList)
                    let data = result
                    data.closePana = ''
                    result = await DeclareResult.findByIdAndUpdate(id, data, { new: true })
                }
            }
            return result
        }
        catch (err) {
            throw err
        }

    }
    async deleteOldDeclareResultHistory() {
        try {
            // Calculate the date 31 days ago from the current date
            const date31DaysAgo = new Date();
            date31DaysAgo.setDate(date31DaysAgo.getDate() - 31);

            // Delete documents older than 31 days
            const result = await DeclareResult.deleteMany({
                timestamp: { $lt: date31DaysAgo }
            });

            console.log(`Deleted ${result.deletedCount} old DeclareResult  history records.`);
        } catch (error) {
            console.error('Error deleting old winning history records:', error);
        }
    }


}


module.exports = new DeclareResultService();