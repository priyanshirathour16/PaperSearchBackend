const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const contactUsController = require('../controllers/contactUsController');

router.post(
    '/',
    [
        body('fullName').notEmpty().withMessage('Full Name is required'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('phone').notEmpty().withMessage('Phone number is required'),
        body('city').notEmpty().withMessage('City is required'),
        body('department').optional(),
        body('message').notEmpty().withMessage('Message is required')
    ],
    contactUsController.submitContact
);

router.get('/', contactUsController.getAllContacts);

router.delete('/:id', contactUsController.deleteContact);

module.exports = router;
