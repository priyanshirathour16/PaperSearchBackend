const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JournalCategory = sequelize.define('JournalCategory', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    route: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
});

module.exports = JournalCategory;
