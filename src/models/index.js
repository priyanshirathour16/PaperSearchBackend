const sequelize = require('../config/database');
const Admin = require('./Admin');
const Author = require('./Author');
const EditorApplication = require('./EditorApplication');
const Journal = require('./Journal');
const EditorialBoard = require('./EditorialBoard');
const JournalIssue = require('./JournalIssue');
const JournalCategory = require('./JournalCategory');
const JournalImpactFactor = require('./JournalImpactFactor');

// Associations
Journal.hasMany(EditorialBoard, { foreignKey: 'journal_id', as: 'editorial_board' });
EditorialBoard.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journal' });
Journal.belongsTo(JournalCategory, { foreignKey: 'category_id', as: 'category' });

JournalCategory.hasMany(Journal, { foreignKey: 'category_id', as: 'journals' });
EditorApplication.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journalData' });
Journal.hasMany(EditorApplication, { foreignKey: 'journal_id', as: 'editorApplications' });

Journal.hasMany(JournalImpactFactor, { foreignKey: 'journal_id', as: 'impact_factors' });
JournalImpactFactor.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journal' });

// JournalIssue associations are defined in the JournalIssue model file

const db = {
    sequelize,
    Admin,
    Author,
    EditorApplication,
    Journal,
    EditorialBoard,
    JournalIssue,
    JournalCategory,
    JournalImpactFactor
};

module.exports = db;
