const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JournalImpactFactor = sequelize.define('JournalImpactFactor', {
    journal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Journals',
            key: 'id'
        }
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    impact_factor: {
        type: DataTypes.DECIMAL(10, 3), // e.g., 1234567.890
        allowNull: false
    }
}, {
    timestamps: true,
    paranoid: true,
    tableName: 'journal_impact_factors'
});

module.exports = JournalImpactFactor;
