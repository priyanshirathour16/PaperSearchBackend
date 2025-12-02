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

module.exports = router;
