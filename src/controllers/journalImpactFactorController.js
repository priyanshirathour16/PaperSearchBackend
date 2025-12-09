const { validationResult } = require('express-validator');
const journalImpactFactorService = require('../services/JournalImpactFactorService');

exports.addImpactFactors = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { journal_id, factors } = req.body;
        // Expecting factors to be an array of { year, impact_factor }

        const result = await journalImpactFactorService.addImpactFactors(journal_id, factors);
        res.status(201).json({
            message: 'Impact factors added successfully',
            data: result
        });
    } catch (error) {
        if (error.message === 'Journal not found') {
            return res.status(404).json({ message: error.message, debug_keys: Object.keys(req.body || {}), debug_val: req.body.journal_id });
        }
        next(error);
    }
};

exports.getImpactFactors = async (req, res, next) => {
    try {
        const journalId = req.params.journalId;
        const result = await journalImpactFactorService.getImpactFactorsByJournalId(journalId);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.deleteImpactFactor = async (req, res, next) => {
    try {
        const id = req.params.id;
        await journalImpactFactorService.deleteImpactFactor(id);
        res.json({ message: 'Impact Factor deleted successfully' });
    } catch (error) {
        if (error.message === 'Impact Factor not found') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};
