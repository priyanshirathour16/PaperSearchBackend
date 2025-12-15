const manuscriptRepository = require('../repositories/ManuscriptRepository');
const journalRepository = require('../repositories/JournalRepository');
const manuscriptAuthorRepository = require('../repositories/ManuscriptAuthorRepository');
const authorRepository = require('../repositories/AuthorRepository');
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');

class ManuscriptService {
    async submitManuscript(data, files) {
        // Validation: Check if journal exists
        const journal = await journalRepository.findById(data.journal);
        if (!journal) {
            throw new Error('Journal not found');
        }

        // Map files
        const manuscriptFile = files['manuscriptFile'] ? files['manuscriptFile'][0] : null;
        const signatureFile = files['signature'] ? files['signature'][0] : null;

        if (!manuscriptFile) {
            throw new Error('Manuscript file is required');
        }

        // Check for existing author
        const existingAuthor = await authorRepository.findByEmail(data.email);
        if (existingAuthor) {
            throw new Error('Author already exists. Please login to submit.');
        }

        let authorId;

        // Start transaction
        const result = await sequelize.transaction(async (t) => {

            // Create new Author
            const tempPassword = 'Password@123'; // Default password
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            const nameParts = data.name.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '.'; // Handle single names

            const newAuthorData = {
                firstName: firstName,
                lastName: lastName,
                email: data.email,
                password: hashedPassword,
                contactNumber: data.phone,
                role: 'author'
            };

            const newAuthor = await authorRepository.create(newAuthorData, { transaction: t });
            authorId = newAuthor.id;

            // Prepare Manuscript Data
            // Parse authors if string (moved inside just to be clean, could be outside too)
            let authors = data.authors;
            if (typeof authors === 'string') {
                try {
                    authors = JSON.parse(authors);
                } catch (e) {
                    console.error("Authors parsing failed:", e);
                    throw new Error('Invalid authors JSON format');
                }
            }

            const manuscriptData = {
                journal_id: parseInt(data.journal),
                author_id: authorId, // Linked to the new author
                // submitter details removed - sourced from author

                paper_title: data.paperTitle,
                word_count: data.wordCount ? parseInt(data.wordCount) : null,
                page_count: data.pageCount ? parseInt(data.pageCount) : null,
                table_count: data.tableCount ? parseInt(data.tableCount) : null,
                figure_count: data.figureCount ? parseInt(data.figureCount) : null,

                reviewer_first_name: data.revFirstName,
                reviewer_last_name: data.revLastName,
                reviewer_email: data.revEmail,
                reviewer_phone: data.revPhone,
                reviewer_institution: data.revInstitution,

                keywords: data.keywords,
                abstract: data.abstract,

                manuscript_file_path: manuscriptFile.path,
                signature_file_path: signatureFile ? signatureFile.path : null,

                status: 'Submitted'
            };

            const manuscript = await manuscriptRepository.create(manuscriptData, t);

            if (authors && Array.isArray(authors) && authors.length > 0) {
                const authorsData = authors.map(author => ({
                    manuscript_id: manuscript.id,
                    first_name: author.firstName,
                    last_name: author.lastName,
                    email: author.email,
                    confirm_email: author.email,
                    phone: author.phone || null,
                    country: author.country || null,
                    institution: author.institution || null,
                    department: author.department || null,
                    state: author.state || null,
                    city: author.city || null,
                    address: author.address || null,
                    is_corresponding_author: author.isCorrespondingAuthor || false
                }));
                await manuscriptAuthorRepository.bulkCreate(authorsData, t);
            }
            return manuscript;
        });

        return result;
    }

    async getAllManuscripts() {
        return await manuscriptRepository.findAllBasic();
    }

    async getManuscriptByPublicId(id) {
        return await manuscriptRepository.findByPublicId(id);
    }
}

module.exports = new ManuscriptService();
