const JournalCategory = require('../models/JournalCategory');

class JournalCategoryRepository {
    async create(data) {
        return await JournalCategory.create(data);
    }

    async findByRoute(route) {
        return await JournalCategory.findOne({ where: { route } });
    }

    async findAll(filter = {}) {
        return await JournalCategory.findAll({ where: filter });
    }

    async findById(id) {
        return await JournalCategory.findByPk(id);
    }

    async updateStatus(id, status) {
        const category = await JournalCategory.findByPk(id);
        if (category) {
            category.status = status;
            await category.save();
            return category;
        }
        return null;
    }
}

module.exports = new JournalCategoryRepository();
