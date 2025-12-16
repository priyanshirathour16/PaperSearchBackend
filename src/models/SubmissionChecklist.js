const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SubmissionChecklist = sequelize.define('SubmissionChecklist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    manuscript_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'manuscripts',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    // Checklist items as per requirements
    is_sole_submission: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'The manuscript is solely submitted to this journal and is not currently under submission to, or consideration by, any other journal or publication.'
    },
    is_not_published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'The manuscript has not been published before in its current or a substantially similar form.'
    },
    is_original_work: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'The Article is my/our original work and does not infringe the intellectual property rights of any other person or entity and cannot be considered as plagiarising any other published work.'
    },
    has_declared_conflicts: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'I/we have declared any potential conflict of interest in the research.'
    },
    has_acknowledged_support: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Any support from a third party has been noted in the Acknowledgements.'
    },
    has_acknowledged_funding: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Sources of funding, if any, have been acknowledged.'
    },
    follows_guidelines: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'The manuscript is submitted as per the journal submission guidelines provided at the journal home page.'
    }
}, {
    timestamps: true,
    tableName: 'submission_checklists'
});

module.exports = SubmissionChecklist;
