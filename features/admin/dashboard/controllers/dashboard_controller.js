// const adminAuthService = require("../services/admin_auth_service")

class AdminDashboardController {

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

            // const{_id, ...other}=value;
            const user = await adminAuthService.loginAdmin(req.body);
            if (!user) {
                res.render('auth/login', { error: "user not found" });
                return;
            }

            res.redirect('/');
            return
            // res.status(httpStatusCodes.ok).json({ success: true, message: "User ", data: user });
        } catch (error) {
            res.render('auth/login', { error: error.message });
            // res.status(500).json({ success: false, message: error.message, data: {} });
        }
    }

}

module.exports = new AdminDashboardController();