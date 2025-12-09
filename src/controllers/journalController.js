const { validationResult } = require('express-validator');
const journalService = require('../services/JournalService');
const { encrypt, decrypt } = require('../utils/encryption');

exports.createJournal = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (req.file) {
            req.body.image = req.file.filename;
        }

        const journal = await journalService.createJournal(req.body);
        res.status(201).json(journal);
    } catch (error) {
        next(error);
    }
};

exports.getAllJournals = async (req, res, next) => {
    try {
        const journals = await journalService.getAllJournals();
        const journalsWithEncryptedIds = journals.map(journal => {
            const journalData = journal.toJSON ? journal.toJSON() : journal;
            return {
                ...journalData,
                encryptedId: encrypt(journal.id)
            };
        });
        res.json(journalsWithEncryptedIds);
    } catch (error) {
        next(error);
    }
};

exports.getJournalById = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);
        const journal = await journalService.getJournalById(id);
        res.json(journal);
    } catch (error) {
        if (error.message === 'Journal not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Invalid encrypted ID') {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        next(error);
    }
};

exports.updateJournal = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (req.file) {
            req.body.image = req.file.filename;
        }

        const id = decrypt(req.params.id);
        const journal = await journalService.updateJournal(id, req.body);
        res.json(journal);
    } catch (error) {
        if (error.message === 'Journal not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Invalid encrypted ID') {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        next(error);
    }
};

exports.deleteJournal = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);
        await journalService.deleteJournal(id);
        res.json({ message: 'Journal deleted successfully' });
    } catch (error) {
        if (error.message === 'Journal not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Invalid encrypted ID') {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        next(error);
    }
};
exports.addEditor = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);
        const editor = req.body;
        const newEditor = await journalService.addEditor(id, editor);
        res.status(201).json(newEditor);
    } catch (error) {
        if (error.message === 'Journal not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Invalid encrypted ID') {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        next(error);
    }
};

exports.deleteEditor = async (req, res, next) => {
    try {
        const editorId = req.params.editorId;
        console.log(`Attempting to delete editor with ID: ${editorId}`);
        const result = await journalService.deleteEditor(editorId);
        console.log(`Delete result:`, result);
        if (result[0] === 0) {
            console.log('No rows updated. ID might not exist or status was already 0.');
        }
        res.json({ message: 'Editor deleted successfully' });
    } catch (error) {
        console.error('Error deleting editor:', error);
        next(error);
    }
};

exports.getJournalByCategoryRoute = async (req, res, next) => {
    try {
        const { route } = req.body;
        if (!route) {
            return res.status(400).json({ message: 'Category route is required' });
        }
        const journalDetails = await journalService.getJournalByCategoryRoute(route);
        res.json(journalDetails);
    } catch (error) {
        if (error.message === 'Category not found' || error.message === 'Journal not found in this category') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};
