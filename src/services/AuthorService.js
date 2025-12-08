const authorRepository = require('../repositories/AuthorRepository');

class AuthorService {
    async getAllAuthors() {
        return await authorRepository.findAll();
    }

    async getAuthorById(id) {
        const author = await authorRepository.findById(id);
        if (!author) {
            throw new Error('Author not found');
        }
        return author;
    }
}

module.exports = new AuthorService();
