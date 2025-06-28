// validators/authValidator.js
const { body, validationResult } = require('express-validator');

exports.validateRegistration = [
    body('name').trim().isLength({ min: 1 }).withMessage('Username must be at least 3 characters long'),
    body('phone').trim().isMobilePhone().withMessage('Invalid phone Number'),
    body('password').trim().isLength({ min: 4 }).withMessage('Password must be at least 6 characters long'),
    // body('role').isIn(['user', 'admin', ]).withMessage('Invalid user role'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

exports.validateOtp = [
    body('token').trim().isJWT().withMessage('Invalid token'),
    body('otp').trim().isNumeric().withMessage('Invalid otp'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
]
exports.validateResendOtp = [
    body('phone').trim().isMobilePhone().withMessage('Invalid phone number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }}
]

exports.validateLogin = [
    body('phone').trim().isMobilePhone().withMessage('Invalid phone number'),
    body('password').trim().isLength({ min: 4 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
