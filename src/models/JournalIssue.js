const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Journal = require('./Journal');

const JournalIssue = sequelize.define('JournalIssue', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    journal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Journals',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    volume: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issue_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1900,
            max: 2100,
        },
    },
}, {
    tableName: 'journal_issues',
    timestamps: true,
});

// Define associations
JournalIssue.belongsTo(Journal, {
    foreignKey: 'journal_id',
    as: 'journal',
});

Journal.hasMany(JournalIssue, {
    foreignKey: 'journal_id',
    as: 'issues',
});

module.exports = JournalIssue;
