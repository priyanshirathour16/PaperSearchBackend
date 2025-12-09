const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EditorApplication = sequelize.define('EditorApplication', {
    journal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Journals',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING
    },
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
    qualification: {
        type: DataTypes.STRING
    },
    specialization: {
        type: DataTypes.STRING
    },
    institute: {
        type: DataTypes.STRING
    },
    cvFile: {
        type: DataTypes.STRING,
        comment: 'Path to the uploaded CV/Resume file'
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'approved', 'rejected']]
        }
    }
}, {
    timestamps: true,
    paranoid: true,
    tableName: 'editor_applications'
});

module.exports = EditorApplication;
