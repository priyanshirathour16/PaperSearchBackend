const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conference = sequelize.define('Conference', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    paranoid: true, // Enable soft delete
});

module.exports = Conference;
