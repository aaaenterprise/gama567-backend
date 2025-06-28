// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../admin/auth/models/admin_model');
const config = require('../../config/appConfig');
const adminAuthuthMiddleware = () => async (req, res, next) => {

    try {

        const token = req.header('Authorization').split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: 'Authentication token is required' });
        }
        const decoded = jwt.verify(token, config.jwtSecret);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        // // Check if the user has the required role
        // if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        //     return res.status(403).json({ error: 'Unauthorized' });
        // }

        req.user = user.toJSON();
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = adminAuthuthMiddleware;
