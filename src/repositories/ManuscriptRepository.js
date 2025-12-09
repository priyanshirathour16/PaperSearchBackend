const Manuscript = require('../models/Manuscript');

class ManuscriptRepository {
    async create(data, transaction) {
        return await Manuscript.create(data, { transaction });
    }

    async findAll() {
        return await Manuscript.findAll();
    }

    async findById(id) {
        return await Manuscript.findByPk(id);
    }
}

module.exports = new ManuscriptRepository();
