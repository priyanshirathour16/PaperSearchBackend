const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EditorialBoard = sequelize.define('EditorialBoard', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    position: {
        type: DataTypes.ENUM('Editor in Chief', 'Editorial Advisory Board'),
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.SMALLINT, // server
        // type: DataTypes.TINYINT, // local
        defaultValue: 1,
    },
});

module.exports = EditorialBoard;
