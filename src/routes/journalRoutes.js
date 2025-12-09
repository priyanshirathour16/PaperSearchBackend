const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { createJournalValidation, updateJournalValidation } = require('../middleware/journalValidation');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const parseJsonFields = require('../middleware/parseJsonMiddleware');

// Public routes
router.post('/details-by-category', journalController.getJournalByCategoryRoute);

router.use(authMiddleware);
router.use(roleMiddleware);

router.post('/', upload.single('image'), parseJsonFields, createJournalValidation, journalController.createJournal);
router.get('/', journalController.getAllJournals);
router.get('/:id', journalController.getJournalById);
router.put('/:id', upload.single('image'), parseJsonFields, updateJournalValidation, journalController.updateJournal);
router.post('/:id/editors', journalController.addEditor);
router.delete('/:id/editors/:editorId', journalController.deleteEditor);
router.delete('/:id', journalController.deleteJournal);

module.exports = router;
