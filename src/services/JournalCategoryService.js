const journalCategoryRepository = require('../repositories/JournalCategoryRepository');

class JournalCategoryService {
    async createJournalCategory(title) {
        try {
            const route = title.toLowerCase().replace(/ /g, '-');
            // Check if it exists but is inactive? For now just create new or return existing.
            // If route unique constraint hits, and it's inactive, maybe we should reactivate it?
            // Keeping it simple for now as per plan.
            const newCategory = await journalCategoryRepository.create({ title, route });
            return newCategory;
        } catch (error) {
            throw error;
        }
    }

    async getAllCategories() {
        // Only return active categories
        return await journalCategoryRepository.findAll({ status: true });
    }

    async deleteJournalCategory(id) {
        // Soft delete: set status to false
        return await journalCategoryRepository.updateStatus(id, false);
    }
}

module.exports = new JournalCategoryService();
