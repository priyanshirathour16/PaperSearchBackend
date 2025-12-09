const ManuscriptAuthor = require('../models/ManuscriptAuthor');

class ManuscriptAuthorRepository {
    async bulkCreate(authors, transaction) {
        return await ManuscriptAuthor.bulkCreate(authors, { transaction });
    }
}

module.exports = new ManuscriptAuthorRepository();
