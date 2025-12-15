const Manuscript = require('../models/Manuscript');
const Journal = require('../models/Journal');
const Author = require('../models/Author'); // Added Author import
const ManuscriptAuthor = require('../models/ManuscriptAuthor');

class ManuscriptRepository {
    async create(data, transaction) {
        return await Manuscript.create(data, { transaction });
    }

    async findAllBasic() {
        const manuscripts = await Manuscript.findAll({
            attributes: ['id', 'manuscript_id', 'createdAt', 'status'], // Removed redundant fields
            include: [
                {
                    model: Journal,
                    as: 'journal',
                    attributes: ['title']
                },
                {
                    model: Author,
                    as: 'author', // Ensure association exists in models!
                    attributes: ['firstName', 'lastName', 'email']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });

        // Map to flat structure for API compatibility
        return manuscripts.map(m => {
            const plain = m.get({ plain: true });
            return {
                ...plain,
                submitter_name: plain.author ? `${plain.author.firstName} ${plain.author.lastName}`.trim() : 'Unknown',
                submitter_email: plain.author ? plain.author.email : 'Unknown'
            };
        });
    }

    async findByPublicId(manuscript_id) {
        const manuscript = await Manuscript.findOne({
            where: { manuscript_id },
            include: [
                {
                    model: Journal,
                    as: 'journal',
                    attributes: ['title', 'print_issn']
                },
                {
                    model: Author,
                    as: 'author',
                    attributes: ['firstName', 'lastName', 'email', 'contactNumber']
                },
                {
                    model: ManuscriptAuthor,
                    as: 'authors'
                }
            ]
        });

        if (!manuscript) return null;

        // Map for API compatibility
        const plain = manuscript.get({ plain: true });
        return {
            ...plain,
            submitter_name: plain.author ? `${plain.author.firstName} ${plain.author.lastName}`.trim() : 'Unknown',
            submitter_email: plain.author ? plain.author.email : 'Unknown',
            submitter_phone: plain.author ? plain.author.contactNumber : null
        };
    }

    async findAll() {
        return await Manuscript.findAll();
    }

    async findById(id) {
        return await Manuscript.findByPk(id);
    }
}

module.exports = new ManuscriptRepository();
