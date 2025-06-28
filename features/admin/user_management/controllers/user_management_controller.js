
const UserManagementServices = require('../services/user_management_service');
const { httpStatusCodes } = require('../../../../common/utils')
class UserManagementController {
    async getAllUsers(req, res) {
        try {

            const games = await UserManagementServices.getAllUsers();
            res.status(httpStatusCodes.ok).json({ success: true, message: "Users ", data: games });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async getUserById(req, res) {
        try {
            const game = await UserManagementServices.getUserById(req.params.id);
            res.status(httpStatusCodes.ok).json({ success: true, message: "User ", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async addUser(req, res) {
        try {
            const game = await UserManagementServices.addUser(req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "User Created ", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async updateUser(req, res) {
        try {
            const game = await UserManagementServices.updateUser(req.params.id, req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "User Updated ", data: game });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

    async deleteUser(req, res) {
        try {

            await UserManagementServices.deleteUser(req.params.id);
            res.status(httpStatusCodes.ok).json({ success: true, message: "user deleted successfully", data: {} });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async getUserStats(req, res) {
        try {

         const data=   await UserManagementServices.getUserStats();
            res.status(httpStatusCodes.ok).json({ success: true, message: "User States", data: data });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

}

module.exports = new UserManagementController();
