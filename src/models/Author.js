const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Author = sequelize.define('Author', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    landMark: {
        type: DataTypes.STRING
    },
    pincode: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    isd: {
        type: DataTypes.STRING
    },
    contactNumber: {
        type: DataTypes.STRING
    },
    altContactNumber: {
        type: DataTypes.STRING
    },
    qualification: {
        type: DataTypes.STRING
    },
    specialization: {
        type: DataTypes.STRING
    },
    institute: {
        type: DataTypes.STRING
    },
    jobTitle: {
        type: DataTypes.STRING
    },
    organization: {
        type: DataTypes.STRING
    },
    orgType: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'author'
    }
}, {
    timestamps: true,
    tableName: 'authors'
});

module.exports = Author;
