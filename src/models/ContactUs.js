const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactUs = sequelize.define('ContactUs', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true,
    paranoid: true, // Enable soft deletes
    tableName: 'contact_us'
});

module.exports = ContactUs;
