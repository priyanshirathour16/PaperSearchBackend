const { body } = require('express-validator');

const createIssueValidation = [
    body('journal_id')
        .notEmpty()
        .withMessage('Journal ID is required')
        .isInt({ min: 1 })
        .withMessage('Journal ID must be a valid integer'),

    body('volume')
        .notEmpty()
        .withMessage('Volume is required')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Volume must be between 1 and 50 characters'),

    body('issue_no')
        .notEmpty()
        .withMessage('Issue number is required')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Issue number must be between 1 and 50 characters'),

    body('year')
        .notEmpty()
        .withMessage('Year is required')
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year must be between 1900 and 2100'),
];

const updateIssueValidation = [
    body('journal_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Journal ID must be a valid integer'),

    body('volume')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Volume must be between 1 and 50 characters'),

    body('issue_no')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Issue number must be between 1 and 50 characters'),

    body('year')
        .optional()
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year must be between 1900 and 2100'),
];

module.exports = {
    createIssueValidation,
    updateIssueValidation,
};
