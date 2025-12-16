const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const otpController = require('../controllers/otpController');

/**
 * @route POST /api/otp/send
 * @desc Send OTP to email for verification
 * @access Public
 */
router.post(
    '/send',
    [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required'),
        body('phone')
            .trim()
            .notEmpty()
            .withMessage('Phone number is required')
    ],
    otpController.sendOTP
);

/**
 * @route POST /api/otp/verify
 * @desc Verify OTP code
 * @access Public
 */
router.post(
    '/verify',
    [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
        body('otp')
            .isLength({ min: 6, max: 6 })
            .withMessage('OTP must be 6 digits')
            .isNumeric()
            .withMessage('OTP must contain only numbers')
    ],
    otpController.verifyOTP
);

module.exports = router;
