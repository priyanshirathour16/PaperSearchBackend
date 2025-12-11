const Manuscript = require('../models/Manuscript');
const Journal = require('../models/Journal');
const ManuscriptAuthor = require('../models/ManuscriptAuthor');

class ManuscriptRepository {
    async create(data, transaction) {
        return await Manuscript.create(data, { transaction });
    }

    async findAllBasic() {
        return await Manuscript.findAll({
            attributes: ['id', 'manuscript_id', 'submitter_name', 'submitter_email', 'createdAt', 'status'],
            include: [{
                model: Journal,
                as: 'journal',
                attributes: ['title']
            }],
            order: [['updatedAt', 'DESC']]
        });
    }

    async findByPublicId(manuscript_id) {
        return await Manuscript.findOne({
            where: { manuscript_id },
            include: [
                {
                    model: Journal,
                    as: 'journal',
                    attributes: ['title', 'print_issn']
                },
                {
                    model: ManuscriptAuthor,
                    as: 'authors'
                }
            ]
        });
    }

    async findAll() {
        return await Manuscript.findAll();
    }

    async findById(id) {
        return await Manuscript.findByPk(id);
    }
}

module.exports = new ManuscriptRepository();
