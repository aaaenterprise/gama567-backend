// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../../../config/appConfig');
const authMiddleware = (allowedRoles = []) => async (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Authentication token is required' });
    }

    try {
        token = token.split(" ")[1]
        const decoded = jwt.verify(token, config.jwtSecret);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        // Check if the user has the required role
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const currentDate = new Date();

        // Adjust the hours and minutes to match the Kolkata time zone offset
        currentDate.setHours(currentDate.getHours() + 5); // Add 5 hours to adjust for Kolkata time zone
        currentDate.setMinutes(currentDate.getMinutes() + 30); // Add 30 minutes to adjust for Kolkata time zone

        // Convert the date to ISO string format
        const isoString = currentDate.toISOString();
        user.lastActive = isoString;
        await user.save()

        const { password, ...newuser } = user.toJSON();
        // console.log(newuser);
        req.user = newuser
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
