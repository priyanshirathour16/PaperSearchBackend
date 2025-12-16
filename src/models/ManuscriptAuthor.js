const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ManuscriptAuthor = sequelize.define('ManuscriptAuthor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    manuscript_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'manuscripts',  // server
            // model: 'Manuscripts',  // local
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    confirm_email: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },

    country: { type: DataTypes.STRING, allowNull: true },
    institution: { type: DataTypes.STRING, allowNull: true },
    designation: { type: DataTypes.STRING, allowNull: true },
    department: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },

    is_corresponding_author: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    tableName: 'manuscript_authors'
});

module.exports = ManuscriptAuthor;
