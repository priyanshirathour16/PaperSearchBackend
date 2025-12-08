const { EditorApplication } = require('../models');

class EditorApplicationRepository {
    async findByEmail(email) {
        return await EditorApplication.findOne({ where: { email } });
    }

    async create(data) {
        return await EditorApplication.create(data);
    }
}

module.exports = new EditorApplicationRepository();
