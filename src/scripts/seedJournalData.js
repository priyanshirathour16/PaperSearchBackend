const { sequelize, Journal, JournalIssue, JournalCategory } = require('../models');

const seedData = async () => {
    try {
        await sequelize.sync();

        // Ensure a category exists
        const [category] = await JournalCategory.findOrCreate({
            where: { category_name: 'Science' },
            defaults: { category_name: 'Science' }
        });

        // Ensure a journal exists
        const [journal] = await Journal.findOrCreate({
            where: { id: 1 },
            defaults: {
                title: 'Test Journal',
                category_id: category.id,
                journal_key: 'TJ',
                abbreviation: 'TJ',
                frequency: 'Monthly',
                issn: '1234-5678',
                e_issn: '8765-4321',
                start_year: 2024,
                email: 'journal@test.com',
                description: 'Test Journal Description',
                scope: 'Test Scope',
                print_version: true,
                online_version: true,
                status: 'Active',
                logo_path: 'uploads/logo.png',
                cover_image_path: 'uploads/cover.png'
            }
        });

        // Ensure an issue exists
        const [issue] = await JournalIssue.findOrCreate({
            where: { id: 1 },
            defaults: {
                journal_id: journal.id,
                volume: 'Vol 1',
                issue_no: 'Issue 1',
                year: 2024
            }
        });

        console.log('Seeded Journal and Issue');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await sequelize.close();
    }
};

seedData();
