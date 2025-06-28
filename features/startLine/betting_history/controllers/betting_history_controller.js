
const BettingHistoryServices = require('../services/betting_history_services');
const { httpStatusCodes } = require('../../../../common/utils')
class BettingHistoryController {


    async getAllBettingHistory(req, res) {
        try {
            const game = await BettingHistoryServices.getAllBettingHistory(req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Betting History ", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async getBettingHistoryByUserId(req, res) {
        try {
            const game = await BettingHistoryServices.getBettingHistoryByUserId(req.params.userId);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Betting History ", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async createBettingHistory(req, res) {
        try {
            const game = await BettingHistoryServices.createBettingHistory(req.user.id.toString(), req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Betting History created", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async updateBettingHistory(req, res) {
        try {
            const game = await BettingHistoryServices.updateBettingHistory( req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Betting History Updated", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }



}

module.exports = new BettingHistoryController();
