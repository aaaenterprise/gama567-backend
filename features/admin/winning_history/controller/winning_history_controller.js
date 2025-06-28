const WinningHistoryService = require('../services/winning_history_service');
const { httpStatusCodes } = require('../../../../common/utils')

class WinningHistoryController{
    async getWinningHistoryByUserId(req, res) {
        try {

            const setting = await WinningHistoryService.getWinningHistoryByUserId(req.params.userId);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Winning History ", data: setting });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async getWinningHistory(req, res) {
        try {

            const setting = await WinningHistoryService.getWinningHistory(req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Winning History ", data: setting });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

}

module.exports=new WinningHistoryController();