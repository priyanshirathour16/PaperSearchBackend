const { validationResult } = require('express-validator');
const contactUsService = require('../services/ContactUsService');

exports.submitContact = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const data = req.body;
        const result = await contactUsService.submitContact(data);

        res.status(201).json({
            message: 'Contact inquiry submitted successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllContacts = async (req, res, next) => {
    try {
        const result = await contactUsService.getAllContacts();
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.deleteContact = async (req, res, next) => {
    try {
        const result = await contactUsService.deleteContact(req.params.id);
        res.json(result);
    } catch (error) {
        if (error.message === 'Contact inquiry not found') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};
