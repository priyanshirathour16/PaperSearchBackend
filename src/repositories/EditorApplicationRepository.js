const EditorApplication = require('../models/EditorApplication');

class EditorApplicationRepository {
    async create(data) {
        return await EditorApplication.create(data);
    }

    async findAll() {
        const { Journal } = require('../models');
        return await EditorApplication.findAll({
            include: [{
                model: Journal,
                as: 'journalData',
                attributes: ['title']
            }],
            order: [['updatedAt', 'DESC']]
        });
    }

    async findById(id) {
        const { Journal } = require('../models');
        return await EditorApplication.findByPk(id, {
            include: [{
                model: Journal,
                as: 'journalData',
                attributes: ['title']
            }]
        });
    }

    async findByEmail(email) {
        return await EditorApplication.findOne({ where: { email } });
    }

    async delete(id) {
        return await EditorApplication.destroy({ where: { id } });
    }
}

module.exports = new EditorApplicationRepository();
