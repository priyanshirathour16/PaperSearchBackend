const { sequelize, EditorApplication } = require('../models');

async function updateSchema() {
    try {
        console.log('Syncing EditorApplication table (paranoid mode)...');
        await EditorApplication.sync({ alter: true });
        console.log('EditorApplication table schema updated.');
    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await sequelize.close();
    }
}

updateSchema();
