
const gameScheduleService = require('../services/game_management_services');
const { httpStatusCodes } = require('../../../../common/utils')
class GameManagementController {
    async getAllGameManagements(req, res) {
        try {

            const games = await gameScheduleService.getAllGames();
            res.status(httpStatusCodes.ok).json({ success: true, message: "Games ", data: games });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async getGameManagementById(req, res) {
        try {
            const game = await gameScheduleService.getGameById(req.params.id);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Games ", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async getGameManagementByName(req, res) {
        try {
            const game = await gameScheduleService.getGameByGameName(req.params.gameName);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Games ", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async createGameManagement(req, res) {
        try {
            const game = await gameScheduleService.addGame(req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Games Created", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async updateGameManagement(req, res) {
        try {
            const game = await gameScheduleService.updateGame(req.params.id, req.body);
             res.status(httpStatusCodes.ok).json({ success: true, message: "Games Updated", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async deleteGameManagement(req, res) {
        try {

            await gameScheduleService.deleteGame(req.params.id);
            res.status(httpStatusCodes.ok).json({ success: true, message: "game deleted successfully", data: {} });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async updateGameRate(req, res) {
        try {
            const game = await gameScheduleService.updateGameRate(req.params.id, req.body);
             res.status(httpStatusCodes.ok).json({ success: true, message: "Games Rate updated", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async getGameRate(req, res) {
        try {

            const game = await gameScheduleService.getGameRate(req.user.id.toString());
             res.status(httpStatusCodes.ok).json({ success: true, message: "Games Rate", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async addGameRate(req, res) {
        try {

            const game = await gameScheduleService.addGameRate(req.body)
             res.status(httpStatusCodes.ok).json({ success: true, message: "Games Rate", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
}

module.exports = new GameManagementController();
