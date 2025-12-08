const { Author } = require('../models');

class AuthorRepository {
    async findByEmail(email) {
        return await Author.findOne({ where: { email } });
    }

    async create(authorData) {
        return await Author.create(authorData);
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
}

module.exports = new AuthorRepository();
