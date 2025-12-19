const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publication = sequelize.define('Publication', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    journal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Journals',
            key: 'id'
        }
    },
    issue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'journal_issues', // Note: Table name is 'journal_issues' in JournalIssue.js
            key: 'id'
        }
    },
    manuscript_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Public facing Manuscript ID string'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    doi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pages: {
        type: DataTypes.STRING,
        allowNull: true
    },
    author_affiliations: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    abstract_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    abstract_keywords: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    abstract_references: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    pdf_path: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    paranoid: true,
    tableName: 'publications'
});

module.exports = Publication;
