const db = require('../models');

async function updateSchema() {
    try {
        console.log('Syncing database schema (alter: true)...');
        await db.sequelize.sync({ alter: true });
        console.log('Database schema updated successfully.');
    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await db.sequelize.close();
    }
}

updateSchema();
