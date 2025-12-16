const manuscriptRepository = require('../repositories/ManuscriptRepository');
const journalRepository = require('../repositories/JournalRepository');
const manuscriptAuthorRepository = require('../repositories/ManuscriptAuthorRepository');
const authorRepository = require('../repositories/AuthorRepository');
const submissionChecklistRepository = require('../repositories/SubmissionChecklistRepository');
const { sequelize } = require('../models');
const emailService = require('../utils/emailService');
const { submissionAcknowledgmentTemplate } = require('../utils/emailTemplates');
const { numberToWords, validateAbstractWordCount } = require('../utils/textUtils');

class ManuscriptService {
    /**
     * Complete manuscript submission
     * Author account must already exist (created during OTP verification)
     */
    async submitManuscript(data, files) {
        // Validation: Check if journal exists
        const journal = await journalRepository.findById(data.journalId || data.journal);
        if (!journal) {
            throw new Error('Journal not found');
        }

        // Validate abstract word count
        if (data.abstract) {
            const abstractValidation = validateAbstractWordCount(data.abstract, 200);
            if (!abstractValidation.valid) {
                throw new Error(abstractValidation.message);
            }
        }

        // Map files
        const manuscriptFile = files['manuscriptFile'] ? files['manuscriptFile'][0] : null;
        const coverLetterFile = files['coverLetter'] ? files['coverLetter'][0] : null;

        if (!manuscriptFile) {
            throw new Error('Manuscript file is required');
        }

        // Check for existing author (should exist from OTP verification)
        const existingAuthor = await authorRepository.findByEmail(data.email);

        if (!existingAuthor) {
            throw new Error('Author account not found. Please verify your email with OTP first.');
        }

        const authorId = existingAuthor.id;

        // Start transaction
        const result = await sequelize.transaction(async (t) => {

            // Generate custom manuscript ID
            const customManuscriptId = await manuscriptRepository.generateManuscriptId(journal.id);

            // Convert word count to text if provided
            let wordCountText = null;
            if (data.wordCount) {
                wordCountText = numberToWords(parseInt(data.wordCount));
            }

            // Parse authors if string
            let authors = data.authors;
            if (typeof authors === 'string') {
                try {
                    authors = JSON.parse(authors);
                } catch (e) {
                    console.error("Authors parsing failed:", e);
                    throw new Error('Invalid authors JSON format');
                }
            }

            // Parse keywords if string
            let keywords = data.keywords;
            if (typeof keywords === 'string') {
                try {
                    keywords = JSON.parse(keywords);
                    if (Array.isArray(keywords)) {
                        keywords = keywords.join(', ');
                    }
                } catch (e) {
                    // If not JSON, use as is
                    keywords = data.keywords;
                }
            }

            // Prepare Manuscript Data
            const manuscriptData = {
                manuscript_id: customManuscriptId,
                journal_id: parseInt(data.journalId || data.journal),
                author_id: authorId,

                // Paper Details
                paper_title: data.paperTitle || data.title,
                manuscript_type: data.manuscriptType,
                word_count: data.wordCount ? parseInt(data.wordCount) : null,
                no_of_words_text: wordCountText,
                page_count: data.pageCount ? parseInt(data.pageCount) : null,
                table_count: data.tableCount ? parseInt(data.tableCount) : null,
                figure_count: data.figureCount ? parseInt(data.figureCount) : null,

                // Reviewer Suggestions
                reviewer_first_name: data.reviewerFirstName || data.revFirstName,
                reviewer_last_name: data.reviewerLastName || data.revLastName,
                reviewer_email: data.reviewerEmail || data.revEmail,
                reviewer_phone: data.reviewerPhone || data.revPhone,
                reviewer_country: data.reviewerCountry || data.revCountry,
                reviewer_institution: data.reviewerInstitution || data.revInstitution,
                reviewer_designation: data.reviewerDesignation || data.revDesignation,
                reviewer_specialisation: data.reviewerSpecialisation || data.revSpecialisation,
                reviewer_department: data.reviewerDepartment || data.revDepartment,
                reviewer_state: data.reviewerState || data.revState,
                reviewer_city: data.reviewerCity || data.revCity,
                reviewer_address: data.reviewerAddress || data.revAddress,

                // Content
                keywords: keywords,
                abstract: data.abstract,

                // Files
                manuscript_file_path: manuscriptFile.path,
                cover_letter_path: coverLetterFile ? coverLetterFile.path : null,

                status: 'Submitted'
            };

            const manuscript = await manuscriptRepository.create(manuscriptData, t);

            // Add manuscript authors if provided
            if (authors && Array.isArray(authors) && authors.length > 0) {
                const authorsData = authors.map(author => ({
                    manuscript_id: manuscript.id,
                    first_name: author.firstName,
                    last_name: author.lastName,
                    email: author.email,
                    confirm_email: author.confirmEmail || author.email,
                    phone: author.phone || null,
                    country: author.country || null,
                    institution: author.institution || null,
                    designation: author.designation || null,
                    department: author.department || null,
                    state: author.state || null,
                    city: author.city || null,
                    address: author.address || null,
                    is_corresponding_author: author.isCorrespondingAuthor || false
                }));
                await manuscriptAuthorRepository.bulkCreate(authorsData, t);
            }

            // Add submission checklist if provided
            if (data.checklist) {
                const checklistData = {
                    manuscript_id: manuscript.id,
                    is_sole_submission: data.checklist.isSoleSubmission || false,
                    is_not_published: data.checklist.isNotPublished || false,
                    is_original_work: data.checklist.isOriginalWork || false,
                    has_declared_conflicts: data.checklist.hasDeclaredConflicts || false,
                    has_acknowledged_support: data.checklist.hasAcknowledgedSupport || false,
                    has_acknowledged_funding: data.checklist.hasAcknowledgedFunding || false,
                    follows_guidelines: data.checklist.followsGuidelines || false
                };
                await submissionChecklistRepository.create(checklistData, t);
            }

            return { manuscript, customManuscriptId };
        });

        // Send submission acknowledgment email after transaction completes
        try {
            await emailService.sendEmail({
                to: data.email,
                subject: 'Manuscript Submission Successful - ELK Journals',
                html: submissionAcknowledgmentTemplate({
                    name: existingAuthor.firstName + ' ' + existingAuthor.lastName,
                    manuscriptId: result.customManuscriptId,
                    journalName: journal.title,
                    paperTitle: data.paperTitle || data.title,
                    email: data.email
                })
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't throw error - manuscript is already submitted
        }

        return {
            success: true,
            manuscriptId: result.customManuscriptId,
            message: `Congratulations! You have successfully submitted your manuscript. Your manuscript ID is: ${result.customManuscriptId}. Please check your mailbox for acknowledgement of receipt of manuscript.`
        };
    }

    async getAllManuscripts() {
        return await manuscriptRepository.findAllBasic();
    }

    async getManuscriptByPublicId(id) {
        return await manuscriptRepository.findByPublicId(id);
    }

    async getManuscriptsByAuthor(authorId) {
        return await manuscriptRepository.findByAuthorId(authorId);
    }
}

module.exports = new ManuscriptService();
