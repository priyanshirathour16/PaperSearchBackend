const journalCategoryRepository = require('../repositories/JournalCategoryRepository');

class JournalCategoryService {
    async createJournalCategory(title) {
        try {
            const route = title.toLowerCase().replace(/ /g, '-');
            const newCategory = await journalCategoryRepository.create({ title, route });
            return newCategory;
        } catch (error) {
            throw error;
        }
    }

    async getAllCategories() {
        return await journalCategoryRepository.findAll({ status: true });
    }

    async deleteJournalCategory(id) {
        return await journalCategoryRepository.updateStatus(id, false);
    }

    async getCategoriesWithJournals() {
        return await journalCategoryRepository.findAllWithJournals();
    }

    async getCategoriesWithJournalsAndIssues() {
        return await journalCategoryRepository.findAllWithJournalsAndIssues();
    }
}

module.exports = new JournalCategoryService();
