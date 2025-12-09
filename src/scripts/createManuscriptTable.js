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

async function updateSchema() {
    try {
        console.log('Connecting...');
        await sequelize.authenticate();
        console.log('Connected.');

        const queryInterface = sequelize.getQueryInterface();

        console.log('Creating manuscripts table...');
        await queryInterface.createTable('manuscripts', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            manuscript_id: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4, // Use Sequelize.UUIDV4 for default in migration if compatible, or handle in app
                allowNull: false,
                unique: true
            },
            journal_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Journals',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            submitter_name: { type: DataTypes.STRING, allowNull: false },
            submitter_email: { type: DataTypes.STRING, allowNull: false },
            submitter_phone: { type: DataTypes.STRING, allowNull: true },

            paper_title: { type: DataTypes.STRING, allowNull: false },
            word_count: { type: DataTypes.INTEGER, allowNull: true },
            page_count: { type: DataTypes.INTEGER, allowNull: true },
            table_count: { type: DataTypes.INTEGER, allowNull: true },
            figure_count: { type: DataTypes.INTEGER, allowNull: true },

            reviewer_first_name: { type: DataTypes.STRING, allowNull: true },
            reviewer_last_name: { type: DataTypes.STRING, allowNull: true },
            reviewer_email: { type: DataTypes.STRING, allowNull: true },
            reviewer_phone: { type: DataTypes.STRING, allowNull: true },
            reviewer_institution: { type: DataTypes.STRING, allowNull: true },

            keywords: { type: DataTypes.TEXT, allowNull: true },
            abstract: { type: DataTypes.TEXT, allowNull: true },

            authors: { type: DataTypes.JSON, allowNull: false },

            manuscript_file_path: { type: DataTypes.STRING, allowNull: false },
            signature_file_path: { type: DataTypes.STRING, allowNull: true },

            status: { type: DataTypes.STRING, defaultValue: 'Submitted' },

            createdAt: { type: DataTypes.DATE, allowNull: false },
            updatedAt: { type: DataTypes.DATE, allowNull: false },
            deletedAt: { type: DataTypes.DATE, allowNull: true }
        });

        console.log('Table created successfully.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

updateSchema();
