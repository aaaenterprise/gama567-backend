
const WalletTransectionServices = require('../services/wallet_transection_service');
const { httpStatusCodes } = require('../../../common/utils')
class WalletTransectionController {
    // async getAllUsers(req, res) {
    //     try {

    //         const games = await UserManagementServices.getAllUsers();
    //         res.status(httpStatusCodes.ok).json({ success: true, message: "Users ", data: games });
    //     } catch (error) {
    //         res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
    //     }
    // }

    async getUserTransectionById(req, res) {
        try {
            const game = await WalletTransectionServices.getWalletTransectionById(req.params.id);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Games ", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async getTransactionsByTimestampAndDescription(req, res) {
        try {
            const game = await WalletTransectionServices.getTransactionsByTimestampAndDescription(req.query.timestamp);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Games ", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async addMoney(req, res) {
        try {
            const game = await WalletTransectionServices.addMoney(req.params.id,req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Points Added", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async withdrawMoney(req, res) {
        try {
            const game = await WalletTransectionServices.withdrawMoney(req.params.id,req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Points withdrawn", data: game });
        } catch (error) {

            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }



}

module.exports = new WalletTransectionController();
