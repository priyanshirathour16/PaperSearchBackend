const express = require('express');
const { body, check } = require('express-validator');
const router = express.Router();
const journalImpactFactorController = require('../controllers/journalImpactFactorController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware);

router.post(
    '/',
    [
        check('journal_id').isInt().withMessage('Journal ID must be an integer'),
        check('factors').isArray({ min: 1 }).withMessage('Factors must be a non-empty array'),
        check('factors.*.year').isInt().withMessage('Year must be an integer'),
        check('factors.*.impact_factor').isFloat().withMessage('Impact Factor must be a decimal')
    ],
    journalImpactFactorController.addImpactFactors
);

router.get('/:journalId', journalImpactFactorController.getImpactFactors);

router.delete('/:id', journalImpactFactorController.deleteImpactFactor);

module.exports = router;
