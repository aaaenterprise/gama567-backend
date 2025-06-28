
const DeclareResultService = require('../services/declare_result_service');
const { httpStatusCodes } = require('../../../../common/utils')
class DeclareResultController {

    async createResult(req, res) {
        try {

            const games = await DeclareResultService.createResult(req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Results", data: games });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async declareResult(req, res) {
        try {

            const games = await DeclareResultService.declareResult(req.body.resultData, req.body.queryData);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Results saved", data: games });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async getDeclaredResult(req, res) {
        try {

            const games = await DeclareResultService.getDeclaredResult(req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Results data", data: games });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async deleteDeclaredResultById(req, res) {
        try {

            const games = await DeclareResultService.deleteDeclaredResultById(req.params.id, req.query.session);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Results data deleted", data: games });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async getDeclaredResultByGameName(req, res) {
        try {

            const games = await DeclareResultService.getDeclaredResultByGameName(req.params);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Results data", data: games });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }


}
module.exports = new DeclareResultController()