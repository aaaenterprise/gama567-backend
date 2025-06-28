const Settings = require('../models/setting_model');

class SettingsService {

    async createSettings(settingData) {

        try {
            const settingExist = await Settings.findOne({})
            if (settingExist) {
                throw new Error("Setting already exist")
            }


            const setting = await Settings(settingData)
            setting.save()
            return setting;
        }
        catch (error) {
            throw error;
        }
    }
    async updateSettings(settingData) {

        try {

            const setting = await Settings.findByIdAndUpdate(settingData._id, settingData, { new: true })
setting.save()
            return setting;
        }
        catch (error) {
            throw error;
        }
    }
    async getSettings() {

        try {

            const setting = await Settings.findOne({})

            return setting;
        }
        catch (error) {
            throw error;
        }
    }

}

module.exports = new SettingsService();