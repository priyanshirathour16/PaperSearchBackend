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
    // Submitter Details
    submitter_name: { type: DataTypes.STRING, allowNull: false },
    submitter_email: { type: DataTypes.STRING, allowNull: false },
    submitter_phone: { type: DataTypes.STRING, allowNull: true },

    // Paper Details
    paper_title: { type: DataTypes.STRING, allowNull: false },
    word_count: { type: DataTypes.INTEGER, allowNull: true },
    page_count: { type: DataTypes.INTEGER, allowNull: true },
    table_count: { type: DataTypes.INTEGER, allowNull: true },
    figure_count: { type: DataTypes.INTEGER, allowNull: true },

    // Reviewer Suggestions
    reviewer_first_name: { type: DataTypes.STRING, allowNull: true },
    reviewer_last_name: { type: DataTypes.STRING, allowNull: true },
    reviewer_email: { type: DataTypes.STRING, allowNull: true },
    reviewer_phone: { type: DataTypes.STRING, allowNull: true },
    reviewer_institution: { type: DataTypes.STRING, allowNull: true },

    // Content
    keywords: { type: DataTypes.TEXT, allowNull: true },
    abstract: { type: DataTypes.TEXT, allowNull: true },

    // Files
    manuscript_file_path: { type: DataTypes.STRING, allowNull: false },
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
