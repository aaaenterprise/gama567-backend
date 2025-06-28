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
    async deleteOldWinningHistory() {
        try {
            // Calculate the date 31 days ago from the current date
            const date31DaysAgo = new Date();
            date31DaysAgo.setDate(date31DaysAgo.getDate() - 31);

            // Delete documents older than 31 days
            const result = await WinningHistory.deleteMany({
                timestamp: { $lt: date31DaysAgo }
            });

            console.log(`Deleted ${result.deletedCount} old winning history records.`);
        } catch (error) {
            console.error('Error deleting old winning history records:', error);
        }
    }
}

module.exports = new WinningHistoryService();