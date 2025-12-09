const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Re-create configuration logic from database.js
const sequelize = new Sequelize(
    process.env.DB_NAME || 'elkjournals',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'root@123',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'mysql',
        logging: console.log,
    }
);

async function updateSchema() {
    try {
        console.log('Connecting...');
        await sequelize.authenticate();
        console.log('Connected.');

        const queryInterface = sequelize.getQueryInterface();

        console.log('Checking table...');
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
        } else {
            console.log('"journal_id" column already exists.');
        }

        console.log('Done.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

updateSchema();
