const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email').trim().toLowerCase(),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    authController.login
);

router.post(
    '/register',
    [
        body('firstName').notEmpty().withMessage('First Name is required'),
        body('lastName').notEmpty().withMessage('Last Name is required'),
        body('email').isEmail().withMessage('Please enter a valid email').trim().toLowerCase(),
        body('confirmEmail').custom((value, { req }) => {
            if (value !== req.body.email) {
                throw new Error('Email confirmation does not match email');
            }
            return true;
        }),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
        body('role').equals('author').withMessage('Role must be author'),
    ],
    authController.register
);

router.post(
    '/send-otp',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required').trim().toLowerCase(),
        body('phone').notEmpty().withMessage('Phone number is required')
    ],
    authController.sendOtp
);

router.post(
    '/verify-otp-login',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required').trim().toLowerCase(),
        body('phone').notEmpty().withMessage('Phone number is required')
    ],
    authController.verifyOtpLogin
);

router.post(
    '/verify-user',
    [
        body('email').isEmail().withMessage('Please enter a valid email').trim().toLowerCase(),
    ],
    authController.verifyUser
);

router.post(
    '/reset-password',
    [
        body('email').isEmail().withMessage('Please enter a valid email').trim().toLowerCase(),
        body('role').isIn(['author', 'editor']).withMessage('Role must be author or editor'),
        body('newPassword').isLength({ min: 6 }).withMessage('New Password must be at least 6 characters long')
    ],
    authController.resetPassword
);

const authMiddleware = require('../middleware/authMiddleware');

router.post(
    '/change-password',
    authMiddleware,
    [
        body('currentPassword').notEmpty().withMessage('Current Password is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New Password must be at least 6 characters long')
    ],
    authController.changePassword
);

module.exports = router;
