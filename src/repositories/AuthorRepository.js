const { Author } = require('../models');

class AuthorRepository {
    async findByEmail(email) {
        return await Author.findOne({ where: { email } });
    }

    async create(authorData) {
        return await Author.create(authorData);
    }
}

module.exports = new AuthorRepository();
