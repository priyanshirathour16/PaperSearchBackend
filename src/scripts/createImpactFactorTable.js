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

        console.log('Creating journal_impact_factors table...');
        await queryInterface.createTable('journal_impact_factors', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
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
            year: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            impact_factor: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        });

        console.log('Table created successfully.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

updateSchema();
