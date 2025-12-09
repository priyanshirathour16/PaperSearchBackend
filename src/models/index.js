const sequelize = require('../config/database');
const Admin = require('./Admin');
const Author = require('./Author');
const EditorApplication = require('./EditorApplication');
const Journal = require('./Journal');
const EditorialBoard = require('./EditorialBoard');
const JournalIssue = require('./JournalIssue');
const JournalCategory = require('./JournalCategory');

// Associations
Journal.hasMany(EditorialBoard, { foreignKey: 'journal_id', as: 'editorial_board' });
EditorialBoard.belongsTo(Journal, { foreignKey: 'journal_id', as: 'journal' });

// JournalIssue associations are defined in the JournalIssue model file

const db = {
    sequelize,
    Admin,
    Author,
    EditorApplication,
    Journal,
    EditorialBoard,
    JournalIssue,
    JournalCategory
};

module.exports = db;
