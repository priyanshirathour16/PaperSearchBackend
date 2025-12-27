const JournalCategory = require('../models/JournalCategory');

class JournalCategoryRepository {
    async create(data) {
        return await JournalCategory.create(data);
    }

    async findByRoute(route) {
        return await JournalCategory.findOne({ where: { route } });
    }

    async findAll(filter = {}) {
        return await JournalCategory.findAll({
            where: filter,
            order: [['updatedAt', 'DESC']]
        });
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

    async findAllWithJournals() {
        const { Journal } = require('../models');
        return await JournalCategory.findAll({
            where: { status: true },
            include: [{
                model: Journal,
                as: 'journals',
                attributes: ['id', 'print_issn', 'e_issn', 'title']
            }],
            order: [['title', 'ASC']]
        });
    }

    async findAllWithJournalsAndIssues() {
        const { Journal, JournalIssue } = require('../models');
        return await JournalCategory.findAll({
            where: { status: true },
            attributes: ['id', 'title', 'route'],
            include: [{
                model: Journal,
                as: 'journals',
                attributes: ['id', 'title', 'print_issn', 'e_issn'],
                include: [{
                    model: JournalIssue,
                    as: 'issues'
                }]
            }],
            order: [['title', 'ASC']]
        });
    }
}

module.exports = new JournalCategoryRepository();
