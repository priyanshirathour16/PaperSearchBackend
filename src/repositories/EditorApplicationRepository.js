const { EditorApplication } = require('../models');

class EditorApplicationRepository {
    async findByEmail(email) {
        return await EditorApplication.findOne({ where: { email } });
    }

    async create(data) {
        return await EditorApplication.create(data);
    }

    async findAll() {
        return await EditorApplication.findAll({
            attributes: { exclude: ['password'] }
        });
    }

    async findById(id) {
        return await EditorApplication.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
    }
}

module.exports = new EditorApplicationRepository();
