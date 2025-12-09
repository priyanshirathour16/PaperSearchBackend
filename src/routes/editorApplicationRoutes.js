const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const editorApplicationController = require('../controllers/editorApplicationController');
const documentUpload = require('../middleware/documentUploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
    '/',
    documentUpload.single('file'), // 'file' matches the curl form-data name
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
        body('journal').notEmpty().withMessage('Journal is required'),
    ],
    editorApplicationController.submitApplication
);

// Admin only routes
router.get('/', authMiddleware, roleMiddleware, editorApplicationController.getAllApplications);
router.get('/:id', authMiddleware, roleMiddleware, editorApplicationController.getApplicationById);
router.delete('/:id', authMiddleware, roleMiddleware, editorApplicationController.deleteApplication);

module.exports = router;
