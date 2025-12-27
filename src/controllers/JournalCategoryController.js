const journalCategoryService = require('../services/JournalCategoryService');

class JournalCategoryController {
    async createJournalCategory(req, res, next) {
        try {
            const { title } = req.body;
            if (!title) {
                return res.status(400).json({ message: 'Title is required' });
            }
            const newCategory = await journalCategoryService.createJournalCategory(title);
            res.status(201).json(newCategory);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'Category with this title already exists' });
            }
            next(error);
        }
    }

    async getAllCategories(req, res, next) {
        try {
            const categories = await journalCategoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    async deleteJournalCategory(req, res, next) {
        try {
            const { id } = req.params;
            const deletedCategory = await journalCategoryService.deleteJournalCategory(id);
            if (!deletedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async getCategoriesWithJournals(req, res, next) {
        try {
            const categories = await journalCategoryService.getCategoriesWithJournals();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    async getCategoriesWithJournalsAndIssues(req, res, next) {
        try {
            const categories = await journalCategoryService.getCategoriesWithJournalsAndIssues();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new JournalCategoryController();
