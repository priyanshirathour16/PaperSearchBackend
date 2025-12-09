require('dotenv').config();
const { sequelize } = require('../models');
const { DataTypes } = require('sequelize');

async function updateSchema() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connection established.');

        console.log('Updating EditorApplication schema...');
        const queryInterface = sequelize.getQueryInterface();

        // Check if column exists
        const tableDescription = await queryInterface.describeTable('editor_applications');

        if (tableDescription.journal) {
            console.log('Removing "journal" column...');
            await queryInterface.removeColumn('editor_applications', 'journal');
        }

        if (!tableDescription.journal_id) {
            console.log('Adding "journal_id" column...');
            await queryInterface.addColumn('editor_applications', 'journal_id', {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                references: {
                    model: 'Journals',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }

        console.log('Schema update complete.');
    } catch (error) {
        console.error('Schema update failed:', error);
    } finally {
        await sequelize.close();
    }
}

updateSchema();
