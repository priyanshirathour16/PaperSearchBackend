const { validationResult } = require('express-validator');
const authService = require('../services/AuthService');

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const result = await authService.login(email, password);

        res.json({
            success: true,
            message: 'Login successful',
            ...result
        });
    } catch (error) {
        console.log("error", error)
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ message: error.message });
        }
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const authorData = req.body;
        const result = await authService.registerAuthor(authorData);

        res.status(201).json({ message: 'Author registered successfully', author: result });
    } catch (error) {
        if (error.message === 'Author already exists with this email') {
            return res.status(409).json({ message: error.message });
        }
        if (error.message === 'Passwords do not match') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

exports.sendOtp = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone } = req.body;
        const result = await authService.sendOtp(name, email, phone);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.verifyOtpLogin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone } = req.body;
        // Verify OTP logic presumed done on frontend as per request flow

        const result = await authService.verifyOtpLogin(name, email, phone);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;
        // User should be attached to req by auth middleware
        const { id, role } = req.user;

        if (!id || !role) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const result = await authService.changePassword(id, role, currentPassword, newPassword);

        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Current password incorrect') {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === 'User not found') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

exports.verifyUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;
        const result = await authService.verifyUser(email);

        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'User not found in Author or Editor records') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, role, newPassword } = req.body;
        const result = await authService.resetPassword(email, role, newPassword);

        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Invalid role') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};
