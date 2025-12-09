const { body } = require('express-validator');

exports.createJournalValidation = [
    body('title').notEmpty().withMessage('Journal title is required'),
    body('category_id').notEmpty().withMessage('Category ID is required').isInt().withMessage('Category ID must be an integer'),
    body('print_issn').optional(),
    body('e_issn').optional(),
    body('frequency').optional().isIn(['Annual', 'Bi-annual', 'Tri-annual', 'Quarterly', 'Monthly', 'Bi-monthly']).withMessage('Invalid frequency'),
    body('start_year').optional().isInt().withMessage('Start year must be an integer'),
    body('end_year').optional().isInt().withMessage('End year must be an integer'),
    body('editorial_board').optional().isArray().withMessage('Editorial board must be an array'),
    body('editorial_board.*.name').notEmpty().withMessage('Editor name is required'),
    body('editorial_board.*.position').isIn(['Editor in Chief', 'Editorial Advisory Board']).withMessage('Invalid editor position'),
    body('editorial_board.*.profile_link').optional().isURL().withMessage('Invalid profile link URL'),
];

exports.updateJournalValidation = [
    body('title').optional().notEmpty().withMessage('Journal title cannot be empty'),
    body('category_id').optional().isInt().withMessage('Category ID must be an integer'),
    body('frequency').optional().isIn(['Annual', 'Bi-annual', 'Tri-annual', 'Quarterly', 'Monthly', 'Bi-monthly']).withMessage('Invalid frequency'),
    body('start_year').optional().isInt().withMessage('Start year must be an integer'),
    body('end_year').optional().isInt().withMessage('End year must be an integer'),
    body('editorial_board').optional().isArray().withMessage('Editorial board must be an array'),
    body('editorial_board.*.name').optional().notEmpty().withMessage('Editor name is required'),
    body('editorial_board.*.position').optional().isIn(['Editor in Chief', 'Editorial Advisory Board']).withMessage('Invalid editor position'),
    body('editorial_board.*.profile_link').optional().isURL().withMessage('Invalid profile link URL'),
];
