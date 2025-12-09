const EditorApplication = require('../models/EditorApplication');

class EditorApplicationRepository {
    async create(data) {
        return await EditorApplication.create(data);
    }

    async findAll() {
        return await EditorApplication.findAll();
    }

    async findById(id) {
        return await EditorApplication.findByPk(id);
    }

    async findByEmail(email) {
        return await EditorApplication.findOne({ where: { email } });
    }

    async delete(id) {
        return await EditorApplication.destroy({ where: { id } });
    }
}

module.exports = new EditorApplicationRepository();
