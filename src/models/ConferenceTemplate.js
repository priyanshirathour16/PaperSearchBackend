const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConferenceTemplate = sequelize.define('ConferenceTemplate', {
    conference_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Conferences', // Matches the table name
            key: 'id'
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    organizing_committee: {
        type: DataTypes.TEXT, // Rich Text Editor
        allowNull: true,
    },
    important_dates: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    key_benefits: {
        type: DataTypes.JSON, // Or TEXT
        allowNull: true,
    },
    who_should_join: {
        type: DataTypes.TEXT, // Rich Text Editor
        allowNull: true,
    },
    organizer_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    organizer_logo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    partner_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    conference_objectives: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    program_schedule: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    themes: {
        type: DataTypes.TEXT, // Rich Text Editor
        allowNull: true,
    },
    keynote_speakers: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    venue: {
        type: DataTypes.JSON, // { name: "...", map_url: "..." }
        allowNull: true,
    },
    venue_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    past_conferences: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    organisers: {
        type: DataTypes.TEXT, // Rich Text Editor
        allowNull: true,
    },
    steering_committee: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    review_board: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    call_for_papers: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    guidelines: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    paranoid: true,
});

module.exports = ConferenceTemplate;
