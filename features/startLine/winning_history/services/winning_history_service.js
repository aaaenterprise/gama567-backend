const WinningHistory = require('../models/winning_history_model')

class WinningHistoryService {
    async addWinningHistory(winData) {
        try {
            const win = await WinningHistory(winData)
            win.save();
            return win
        }
        catch (err) {
            throw err
        }
    }
    async getWinningHistory(querydata) {
        const {timestamp, gameName}=querydata;

        try {
            const win = await WinningHistory.find({
                timestamp: {
                    $gte: new Date(`${timestamp}T00:00:00Z`),
                    $lt: new Date(`${timestamp}T23:59:59Z`),
                },
                gameName:gameName
            }).populate("userId")

            return win
        }
        catch (err) {
            throw err
        }
    }
    async getWinningHistoryById(id) {
        try {
            const win = await WinningHistory.findById(id).populate("userId")

            return win
        }
        catch (err) {
            throw err
        }
    }
    async getWinningHistoryByUserId(userId) {
        try {
            const win = await WinningHistory.find({ userId })

            return win
        }
        catch (err) {
            throw err
        }
    }
    async deleteWinningHistoryById(id) {
        try {
            const win = await WinningHistory.findByIdAndDelete(id)

            return win
        }
        catch (err) {
            throw err
        }
    }
    async deleteWinningHistoryByUserId(userId) {
        try {
            const win = await WinningHistory.deleteMany({userId})

            return win
        }
        catch (err) {
            throw err
        }
    }

}

module.exports = new WinningHistoryService();