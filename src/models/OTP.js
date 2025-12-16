const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OTP = sequelize.define('OTP', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    otp_code: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Author name for account creation'
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Author phone number for account creation'
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true,
    tableName: 'otps',
    indexes: [
        {
            fields: ['email', 'otp_code']
        },
        {
            fields: ['expires_at']
        }
    ]
});

module.exports = OTP;
