const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Journal = sequelize.define('Journal', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    print_issn: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    e_issn: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    editors: {
        type: DataTypes.TEXT, // For the general editors field
        allowNull: true,
    },
    frequency: {
        type: DataTypes.ENUM('Annual', 'Bi-annual', 'Tri-annual', 'Quarterly', 'Monthly', 'Bi-monthly'),
        allowNull: true,
    },
    indexation: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    start_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    end_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    mission: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    aims_scope: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    areas_covered: {
        type: DataTypes.JSON, // Storing as JSON array
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

module.exports = Journal;
