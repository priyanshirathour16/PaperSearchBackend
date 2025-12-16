const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manuscript = sequelize.define('Manuscript', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    manuscript_id: { // Public facing ID (e.g., UUID or Generated String)
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
    },
    journal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Journals',
            key: 'id'
        }
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Authors',
            key: 'id'
        }
    },

    // Paper Details
    paper_title: { type: DataTypes.STRING, allowNull: false },
    manuscript_type: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Research paper, Case study, Book review, Review paper, Perspective, Report, Invited article'
    },
    word_count: { type: DataTypes.INTEGER, allowNull: true },
    no_of_words_text: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Word count in alphabetic format, e.g., "Two thousand words only"'
    },
    page_count: { type: DataTypes.INTEGER, allowNull: true },
    table_count: { type: DataTypes.INTEGER, allowNull: true },
    figure_count: { type: DataTypes.INTEGER, allowNull: true },

    // Reviewer Suggestions
    reviewer_first_name: { type: DataTypes.STRING, allowNull: true },
    reviewer_last_name: { type: DataTypes.STRING, allowNull: true },
    reviewer_email: { type: DataTypes.STRING, allowNull: true },
    reviewer_phone: { type: DataTypes.STRING, allowNull: true },
    reviewer_country: { type: DataTypes.STRING, allowNull: true },
    reviewer_institution: { type: DataTypes.STRING, allowNull: true },
    reviewer_designation: { type: DataTypes.STRING, allowNull: true },
    reviewer_specialisation: { type: DataTypes.STRING, allowNull: true },
    reviewer_department: { type: DataTypes.STRING, allowNull: true },
    reviewer_state: { type: DataTypes.STRING, allowNull: true },
    reviewer_city: { type: DataTypes.STRING, allowNull: true },
    reviewer_address: { type: DataTypes.TEXT, allowNull: true },

    // Content
    keywords: { type: DataTypes.TEXT, allowNull: true },
    abstract: { type: DataTypes.TEXT, allowNull: true },

    // Files
    manuscript_file_path: { type: DataTypes.STRING, allowNull: false },
    cover_letter_path: { type: DataTypes.STRING, allowNull: true },
    signature_file_path: { type: DataTypes.STRING, allowNull: true },

    status: {
        type: DataTypes.STRING,
        defaultValue: 'Submitted'
    }
}, {
    timestamps: true,
    paranoid: true,
    tableName: 'manuscripts'
});

module.exports = Manuscript;
