const authorService = require('../services/AuthorService');

exports.getAllAuthors = async (req, res, next) => {
    try {
        const authors = await authorService.getAllAuthors();
        res.json(authors);
    } catch (error) {
        next(error);
    }
};

exports.getAuthorById = async (req, res, next) => {
    try {
        const author = await authorService.getAuthorById(req.params.id);
        res.json(author);
    } catch (error) {
        if (error.message === 'Author not found') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};
