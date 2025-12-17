const { Author } = require('../models');

class AuthorRepository {
    async findByEmail(email) {
        return await Author.findOne({ where: { email } });
    }

    async create(authorData, options) {
        return await Author.create(authorData, options);
    }

    async findAll() {
        return await Author.findAll({
            attributes: { exclude: ['password'] }
        });
    }

    async findById(id) {
        return await Author.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
    }

    async findByIdWithPassword(id) {
        return await Author.findByPk(id);
    }
}

module.exports = new AuthorRepository();
