
const WithdrawPointServices = require('../services/withdraw_point_service');
const { httpStatusCodes } = require('../../../common/utils')
class WithdrawPointController {
    async getAllWithdrawRequest(req, res) {
        try {

            const games = await WithdrawPointServices.getAllWithdrawRequest(req.query);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Users ", data: games });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async getAllWithdrawRequestByUserId(req, res) {
        try {
            const game = await WithdrawPointServices.getAllWithdrawRequestByUserId(req.params.id);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Games ", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async createWithdrawRequest(req, res) {
        try {
            const game = await WithdrawPointServices.createWithdrawRequest( req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Wallet Transection", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async updateWithdrawRequest(req, res) {
        try {
            const game = await WithdrawPointServices.updateWithdrawRequest( req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Wallet Transection", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }



}

module.exports = new WithdrawPointController();
