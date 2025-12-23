const sequelize = require('../config/database');
const Admin = require('./Admin');
const Author = require('./Author');
const EditorApplication = require('./EditorApplication');
const Journal = require('./Journal');
const EditorialBoard = require('./EditorialBoard');
const JournalIssue = require('./JournalIssue');
const JournalCategory = require('./JournalCategory');
const JournalImpactFactor = require('./JournalImpactFactor');
const Manuscript = require('./Manuscript');
const ManuscriptAuthor = require('./ManuscriptAuthor');
const ContactUs = require('./ContactUs');
const OTP = require('./OTP');
const SubmissionChecklist = require('./SubmissionChecklist');
const Publication = require('./Publication');
const Conference = require('./Conference');
const ConferenceTemplate = require('./ConferenceTemplate');

// Associations
Journal.hasMany(EditorialBoard, { foreignKey: 'journal_id', as: 'editorial_board' });
EditorialBoard.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journal' });
Journal.belongsTo(JournalCategory, { foreignKey: 'category_id', as: 'category' });

JournalCategory.hasMany(Journal, { foreignKey: 'category_id', as: 'journals' });
EditorApplication.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journalData' });
Journal.hasMany(EditorApplication, { foreignKey: 'journal_id', as: 'editorApplications' });

Journal.hasMany(JournalImpactFactor, { foreignKey: 'journal_id', as: 'impact_factors' });
JournalImpactFactor.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journal' });

Journal.hasMany(Manuscript, { foreignKey: 'journal_id', as: 'manuscripts' });
Manuscript.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journal' });

Manuscript.hasMany(ManuscriptAuthor, { foreignKey: 'manuscript_id', as: 'authors', onDelete: 'CASCADE' });
ManuscriptAuthor.belongsTo(Manuscript, { foreignKey: 'manuscript_id', as: 'manuscript' });

Author.hasMany(Manuscript, { foreignKey: 'author_id', as: 'manuscripts' });
Manuscript.belongsTo(Author, { foreignKey: 'author_id', as: 'author' });

Manuscript.hasOne(SubmissionChecklist, { foreignKey: 'manuscript_id', as: 'checklist', onDelete: 'CASCADE' });
SubmissionChecklist.belongsTo(Manuscript, { foreignKey: 'manuscript_id', as: 'manuscript' });

// Publication Associations
Journal.hasMany(Publication, { foreignKey: 'journal_id', as: 'publications' });
Publication.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journal' });

JournalIssue.hasMany(Publication, { foreignKey: 'issue_id', as: 'publications' });
Publication.belongsTo(JournalIssue, { foreignKey: 'issue_id', as: 'issue' });

// JournalIssue associations are defined in the JournalIssue model file

// Conference Associations
Conference.hasOne(ConferenceTemplate, { foreignKey: 'conference_id', as: 'template', onDelete: 'CASCADE' });
ConferenceTemplate.belongsTo(Conference, { foreignKey: 'conference_id', as: 'conference' });

const db = {
    sequelize,
    Admin,
    Author,
    EditorApplication,
    Journal,
    EditorialBoard,
    JournalIssue,
    JournalCategory,
    JournalImpactFactor,
    Manuscript,
    ManuscriptAuthor,
    ContactUs,
    OTP,
    SubmissionChecklist,
    SubmissionChecklist,
    Publication,
    Conference,
    ConferenceTemplate
};

module.exports = db;
