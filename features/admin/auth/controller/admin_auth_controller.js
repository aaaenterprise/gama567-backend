const adminAuthService=require("../services/admin_auth_service")
const { httpStatusCodes } = require('../../../../common/utils')
class AdminAuthController {

    async registerAdmin(req, res) {

        try {

            // const{_id, ...other}=value;
            const user = await adminAuthService.registerAdmin(req.body);
            if (!user) {
                return res.status(400).json({ error: 'User Not Created ' });
            }

            res.status(httpStatusCodes.ok).json({ success: true, message: "User ", data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: {} });
        }
    }
    async loginAdmin(req, res) {

        try {


            const user = await adminAuthService.loginAdmin(req.body);
            if (!user) {
                res.status(404).json({ success: false, message: "User Not Found", data: {} });
                return ;
            }


            res.status(httpStatusCodes.ok).json({ success: true, message: "User ", data: user });
        } catch (error) {
            // res.render('auth/login', { error: error.message });
            res.status(500).json({ success: false, message: error.message, data: {} });
        }
    }
    async changeUserPassword(req, res) {

        try {

            const userId = req.user.id.toString();
            const { oldPassword, newPassword } = req.body;

            await adminAuthService.changeUserPassword(userId, oldPassword, newPassword);

            res.status(httpStatusCodes.ok).json({ success: true, message: 'Password changed successfully', data: {} });
        } catch (error) {
            // res.render('auth/login', { error: error.message });
            res.status(500).json({ success: false, message: error.message, data: {} });
        }
    }

}

module.exports = new AdminAuthController();