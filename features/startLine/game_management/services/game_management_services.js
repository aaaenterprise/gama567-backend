
const GameManagement = require('../models/game_management_models')
const GameRate = require('../models/game_rate_model')
const GameUtils = require('../utils/game_utils')
class GameManagementServices {

    async getAllGames() {

        try {
            const todayDate = new Date();

            const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
            const indexOfCurrentDay = todayDate.getDay();
            const currentDay = daysOfWeek[todayDate.getDay()];

            let today = GameUtils.getTodayDate();
            console.log(today);

            const tomorrow = new Date(`${today}T23:59:59Z`);
            today = new Date(`${today}T00:00:00Z`);
            console.log(today, tomorrow, currentDay);

            const result = await GameManagement.aggregate([
                {
                    $addFields: {
                        active: {
                            $cond: {
                                if: {
                                    $or: [
                                        { $eq: ['$active', false] },
                                        {
                                            $and: [
                                                { $eq: ['$hasSpecialTime', true] },
                                                {
                                                    $eq: [
                                                        {
                                                            $arrayElemAt: [
                                                                '$specialSchedule.isOpen',
                                                                indexOfCurrentDay
                                                            ]
                                                        },
                                                        false
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                then: false,
                                else: true,
                                // else: {
                                //     $cond: {
                                //         if: {
                                //             $eq: ['$hasSpecialTime', true]
                                //         },
                                //         then: {
                                //             $arrayElemAt: [
                                //                 '$specialSchedule.isOpen',
                                //                 indexOfCurrentDay
                                //             ]
                                //         },
                                //         else: '$active'
                                //     }
                                // }
                            }
                        }
                    }
                }


                ,
                {
                    $lookup: {
                        from: 'declareresultstars',
                        let: { gameName: '$gameName' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$gameName', '$$gameName'] },
                                            { $gte: ['$timestamp', today] },
                                            { $lt: ['$timestamp', tomorrow] },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    gameName: 1,
                                    openPana: 1,
                                    closePana: 1,
                                    timestamp: 1,
                                },
                            },
                        ],
                        as: 'todayResult',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        gameName: 1,
                        openingTime: 1,
                        active: 1,
                        closingTime: 1,
                        hasSpecialTime: 1,
                        specialSchedule: {
                            $cond: {
                                if: { $eq: ['$hasSpecialTime', true] },
                                then: '$specialSchedule',
                                else: [],
                            },
                        },
                        todayResult: { $arrayElemAt: ['$todayResult', 0] },
                        todayResultDeclared: { $cond: { if: { $gte: [{ $size: '$todayResult' }, 1] }, then: true, else: false } },
                    },
                },
            ]).exec();




            return GameUtils.sortDataByOpeningTime(result)
        }
        catch (error) {
            throw error;
        }
    }
    async getGameById(id) {

        try {
            const gameExist = await GameManagement.findById(id)

            if (!gameExist) {
                throw new Error('Game inot found');
            }

            return gameExist
        }
        catch (error) {
            throw error;
        }
    }
    async getGameByName(gameName) {

        try {
            const gameExist = await GameManagement.findOne({ gameName: gameName })

            if (!gameExist) {
                throw new Error('Game is not found');
            }

            return gameExist
        }
        catch (error) {
            throw error;
        }
    }

    async addGame(gameData) {

        try {
            const gameExist = await GameManagement.findOne({ gameName: gameData.gameName })
            console.log(gameExist);
            if (gameExist) {
                throw new Error('Game is already exist');
            }

            const game = await GameManagement(gameData)
            game.save()
            return game
        }
        catch (error) {
            throw error;
        }
    }
    async updateGame(id, gameData) {

        try {
            const gameExist = await GameManagement.findById(id,)

            if (!gameExist) {
                throw new Error('Game is not found');
            }

            return await GameManagement.findByIdAndUpdate(id, gameData, { new: true });
        }
        catch (error) {
            throw error;
        }
    }
    async deleteGame(id) {

        try {
            const gameExist = await GameManagement.findById(id,)

            if (!gameExist) {
                throw new Error('Game is not found');
            }

            return await GameManagement.findByIdAndDelete(id);
        }
        catch (error) {
            throw error;
        }
    }
    async updateGameRate(id, gameRateData) {

        try {
            const gameExist = await GameRate.findById(id,)

            if (!gameExist) {
                throw new Error('Game is not found');
                // this.addGameRate(gameRateData)
            }

            return await GameRate.findByIdAndUpdate(gameRateData._id, gameRateData, { new: true });
        }
        catch (error) {
            throw error;
        }
    }
    async getGameRate() {

        try {

            const gameExist = await GameRate.findOne()

            if (!gameExist) {
                throw new Error('Game rate not found');
            }

            return gameExist;
        }
        catch (error) {
            throw error;
        }
    }
    async addGameRate(gameRate) {

        try {

            const gameExist = await GameRate.findOne({ userId: gameRate.userId })

            if (gameExist) {
                throw new Error('Game rate already exist');
            }
            const game = await GameRate(gameRate)
            game.save()
            return game;
        }
        catch (error) {
            throw error;
        }
    }
    async resetGameModel(gameRate) {

        try {

            //Update all documents to set todayResultDeclared and active to false
            const result = await GameSchedule.updateMany({}, { $set: { todayResultDeclared: false, active: true } });


            return result;
        }
        catch (error) {
            throw error;
        }
    }


    // reset the game model
    //Update all documents to set todayResultDeclared and active to false
    // GameSchedule.updateMany({ }, { $set: { todayResultDeclared: false, active: true } })
    //   .then((result) => {
    //     console.log(`${result.nModified} documents updated successfully.`);
    // })
    //   .catch ((error) => {
    //     console.error(`Error updating documents: ${error}`);
    // });

}

module.exports = new GameManagementServices;