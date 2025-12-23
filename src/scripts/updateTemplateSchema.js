const { sequelize } = require('../models');
const ConferenceTemplate = require('../models/ConferenceTemplate');

async function updateSchema() {
    console.log('Updating ConferenceTemplate Schema...');
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await ConferenceTemplate.sync({ alter: true });
        console.log('ConferenceTemplate table updated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
}

updateSchema();
