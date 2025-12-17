const Manuscript = require('../models/Manuscript');
const Journal = require('../models/Journal');
const Author = require('../models/Author');
const ManuscriptAuthor = require('../models/ManuscriptAuthor');
const SubmissionChecklist = require('../models/SubmissionChecklist');

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
                    attributes: ['title', 'print_issn', 'e_issn']
                },
                {
                    model: Author,
                    as: 'author',
                    attributes: ['firstName', 'lastName', 'email', 'contactNumber']
                },
                {
                    model: ManuscriptAuthor,
                    as: 'authors'
                },
                {
                    model: SubmissionChecklist,
                    as: 'checklist'
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
    async findByAuthorId(author_id) {
        const manuscripts = await Manuscript.findAll({
            where: { author_id },
            where: { author_id },
            // attributes: removed to return all fields
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
            ],
            order: [['createdAt', 'DESC']]
        });

        return manuscripts;
    }

    /**
     * Generate manuscript ID with journal initials
     * Format: {JOURNAL_INITIALS}-{YEAR}-{SEQUENCE}
     * Example: IJB-2025-001
     */
    async generateManuscriptId(journalId) {
        const journal = await Journal.findByPk(journalId);
        if (!journal) {
            throw new Error('Journal not found');
        }

        // Get journal initials (first letter of each word in title)
        const initials = journal.title
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('');

        // Get current year
        const year = new Date().getFullYear();

        // Find the last manuscript for this journal in this year
        // We search GLOBALLY for this pattern to avoid collisions if two journals have same initials
        const lastManuscript = await Manuscript.findOne({
            where: {
                manuscript_id: {
                    [require('sequelize').Op.like]: `${initials}-${year}-%`
                }
            },
            order: [['createdAt', 'DESC']],
            paranoid: false // Include soft-deleted records to ensure unique ID generation
        });

        console.log(`Generating ID for prefix ${initials}-${year}. Last found: ${lastManuscript ? lastManuscript.manuscript_id : 'None'}`);

        let sequence = 1;
        if (lastManuscript) {
            // Extract sequence number from last manuscript ID
            const parts = lastManuscript.manuscript_id.split('-');
            if (parts.length === 3) {
                sequence = parseInt(parts[2]) + 1;
            }
        }

        // Format sequence with leading zeros (3 digits)
        const sequenceStr = sequence.toString().padStart(3, '0');

        return `${initials}-${year}-${sequenceStr}`;
    }
}

module.exports = new ManuscriptRepository();
