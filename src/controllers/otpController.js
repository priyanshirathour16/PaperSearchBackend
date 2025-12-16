const otpService = require('../services/OTPService');
const { validationResult } = require('express-validator');

class OTPController {
    /**
     * Send OTP to email
     * POST /api/otp/send
     */
    async sendOTP(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email, name, phone } = req.body;

            const result = await otpService.sendOTP(email, name, phone);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Verify OTP
     * POST /api/otp/verify
     */
    async verifyOTP(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email, otp } = req.body;

            const result = await otpService.verifyOTP(email, otp);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OTPController();
