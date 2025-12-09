const { sequelize, Journal } = require('../models');

async function updateSchema() {
    try {
        console.log('Force syncing Journal table to add category_id...');
        // CAUTION: force: true drops table data
        // For development loop here it is acceptable as we deal with mock data mainly
        await Journal.sync({ alter: true });
        console.log('Journal table schema updated.');
    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        await sequelize.close();
    }
}

updateSchema();
