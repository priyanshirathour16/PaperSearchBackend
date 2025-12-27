const express = require('express');
const router = express.Router();
const journalCategoryController = require('../controllers/JournalCategoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protected routes (Admin only)
router.post('/', authMiddleware, roleMiddleware, journalCategoryController.createJournalCategory);
router.delete('/:id', authMiddleware, roleMiddleware, journalCategoryController.deleteJournalCategory);

// Public routes (Optional, but usually you want to fetch them)
router.get('/with-journals', journalCategoryController.getCategoriesWithJournals);
router.get('/with-journals-and-issues', journalCategoryController.getCategoriesWithJournalsAndIssues);
router.get('/', journalCategoryController.getAllCategories);

module.exports = router;
