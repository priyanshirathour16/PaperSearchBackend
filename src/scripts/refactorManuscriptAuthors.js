require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

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

async function refactorSchema() {
    try {
        console.log('Connecting...');
        await sequelize.authenticate();
        console.log('Connected.');

        const queryInterface = sequelize.getQueryInterface();

        console.log('Creating manuscript_authors table...');
        await queryInterface.createTable('manuscript_authors', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            manuscript_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'manuscripts', key: 'id' },
                onDelete: 'CASCADE'
            },
            first_name: { type: DataTypes.STRING, allowNull: false },
            last_name: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false },
            confirm_email: { type: DataTypes.STRING, allowNull: true },
            phone: { type: DataTypes.STRING, allowNull: true },

            country: { type: DataTypes.STRING, allowNull: true },
            institution: { type: DataTypes.STRING, allowNull: true },
            department: { type: DataTypes.STRING, allowNull: true },
            state: { type: DataTypes.STRING, allowNull: true },
            city: { type: DataTypes.STRING, allowNull: true },
            address: { type: DataTypes.TEXT, allowNull: true },

            is_corresponding_author: { type: DataTypes.BOOLEAN, defaultValue: false },

            createdAt: { type: DataTypes.DATE, allowNull: false },
            updatedAt: { type: DataTypes.DATE, allowNull: false }
        });

        console.log('Removing JSON authors column from manuscripts...');
        // Note: SQLite doesn't support DROP COLUMN easily, but assuming MySQL based on config
        // If MySQL:
        try {
            await queryInterface.removeColumn('manuscripts', 'authors');
        } catch (e) {
            console.log('Warning: Could not remove authors column. It might be SQLite or already removed.', e.message);
        }

        console.log('Refactor successful.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

refactorSchema();
