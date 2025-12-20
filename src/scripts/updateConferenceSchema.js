/**
 * Database Schema Update Script
 * Adds deletedAt column to Conferences table for Soft Delete
 */

const { sequelize } = require('../models');
const Conference = require('../models/Conference');

async function updateSchema() {
    console.log('='.repeat(70));
    console.log('CONFERENCE SCHEMA UPDATE (SOFT DELETE)');
    console.log('='.repeat(70));

    try {
        console.log('\n1. Connecting to database...');
        await sequelize.authenticate();
        console.log('✓ Database connection established');

        console.log('\n2. Syncing Conference model (adding deletedAt)...');
        await Conference.sync({ alter: true });
        console.log('✓ Conference table updated');

        console.log('\n3. Verifying schema changes...');
        const description = await sequelize.getQueryInterface().describeTable('Conferences');
        console.log('\nConference table columns:');
        console.log('  - deletedAt:', description.deletedAt ? '✓' : '✗');

        if (description.deletedAt) {
            console.log('\n✅ SCHEMA UPDATE COMPLETED SUCCESSFULLY');
        } else {
            console.log('\n❌ deletedAt column verification failed');
            process.exit(1);
        }

        process.exit(0);
    } catch (error) {
        console.error('\n❌ SCHEMA UPDATE FAILED');
        console.error('Error:', error.message);
        process.exit(1);
    }
}

updateSchema();
