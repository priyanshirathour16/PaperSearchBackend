const express = require('express');
const router = express.Router();
const journalIssueController = require('../controllers/journalIssueController');
const { createIssueValidation, updateIssueValidation } = require('../middleware/journalIssueValidation');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Apply authentication and role middleware to all routes
router.use(authMiddleware);
router.use(roleMiddleware);

// Journal issue routes
router.post('/', createIssueValidation, journalIssueController.createIssue);
router.get('/', journalIssueController.getAllIssues);
router.get('/journal/:journalId', journalIssueController.getIssuesByJournal);
router.get('/:id', journalIssueController.getIssueById);
router.put('/:id', updateIssueValidation, journalIssueController.updateIssue);
router.delete('/:id', journalIssueController.deleteIssue);

module.exports = router;
