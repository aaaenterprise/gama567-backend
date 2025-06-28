const SettingsService = require('../services/settings_services')
const { httpStatusCodes } = require('../../../../common/utils')
class SettingsController {

    async createSettings(req, res) {
        try {

            const setting = await SettingsService.createSettings();
            res.status(httpStatusCodes.ok).json({ success: true, message: "Settings added", data: setting });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async getSetting(req, res) {
        try {

            const setting = await SettingsService.getSettings();
            res.status(httpStatusCodes.ok).json({ success: true, message: "Settings ", data: setting });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }
    async updateSetting(req, res) {
        try {

            const setting = await SettingsService.updateSettings(req.body);
            res.status(httpStatusCodes.ok).json({ success: true, message: "Settings updated", data: setting });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

}
module.exports = new SettingsController();