const ProfileService = require("../services/profileServices")
const { httpStatusCodes } = require('../../../common/utils')
class ProfileController {
    async getUserById(req, res) {
        try {
            (req.user);
            // const user = await ProfileService.getUserByUserId(req.user.id.toString());
            res.status(httpStatusCodes.ok).json({ success: true, message: "User Data ", data: req.user });
        } catch (error) {
            res.status(httpStatusCodes.internalServerError).json({ success: false, message: error.message, data: {} });
        }
    }

}
module.exports = new ProfileController()