const { sequelize } = require('../models');
const Conference = require('../models/Conference');

async function updateSchema() {
    console.log('Updating Conference Schema...');
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await Conference.sync({ alter: true });
        console.log('Conference table updated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
}

updateSchema();
