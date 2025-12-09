const { sequelize, JournalCategory } = require('../models');

async function resetTable() {
    try {
        console.log('Force syncing JournalCategory table...');
        await JournalCategory.sync({ force: true }); // This drops and recreates the table
        console.log('JournalCategory table reset successfully.');
    } catch (error) {
        console.error('Error resetting table:', error);
    } finally {
        await sequelize.close();
    }
}

resetTable();
