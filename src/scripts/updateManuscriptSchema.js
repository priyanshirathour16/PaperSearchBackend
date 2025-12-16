/**
 * Database Schema Update Script
 * Adds new fields to OTP and Manuscript tables
 */

const { sequelize } = require('../models');
const OTP = require('../models/OTP');
const Manuscript = require('../models/Manuscript');
const ManuscriptAuthor = require('../models/ManuscriptAuthor');
const SubmissionChecklist = require('../models/SubmissionChecklist');

async function updateSchema() {
    console.log('='.repeat(70));
    console.log('DATABASE SCHEMA UPDATE');
    console.log('='.repeat(70));

    try {
        console.log('\n1. Connecting to database...');
        await sequelize.authenticate();
        console.log('✓ Database connection established');

        console.log('\n2. Syncing OTP model (adding name and phone fields)...');
        await OTP.sync({ alter: true });
        console.log('✓ OTP table updated');

        console.log('\n3. Syncing Manuscript model (adding new fields)...');
        await Manuscript.sync({ alter: true });
        console.log('✓ Manuscript table updated');

        console.log('\n4. Syncing ManuscriptAuthor model (adding designation)...');
        await ManuscriptAuthor.sync({ alter: true });
        console.log('✓ ManuscriptAuthor table updated');

        console.log('\n5. Syncing SubmissionChecklist model...');
        await SubmissionChecklist.sync({ alter: true });
        console.log('✓ SubmissionChecklist table created/updated');

        console.log('\n6. Verifying schema changes...');

        // Verify OTP table
        const otpDescription = await sequelize.getQueryInterface().describeTable('otps');
        console.log('\nOTP table columns:');
        console.log('  - email:', otpDescription.email ? '✓' : '✗');
        console.log('  - otp_code:', otpDescription.otp_code ? '✓' : '✗');
        console.log('  - name:', otpDescription.name ? '✓' : '✗');
        console.log('  - phone:', otpDescription.phone ? '✓' : '✗');
        console.log('  - expires_at:', otpDescription.expires_at ? '✓' : '✗');
        console.log('  - is_verified:', otpDescription.is_verified ? '✓' : '✗');

        // Verify Manuscript table
        const manuscriptDescription = await sequelize.getQueryInterface().describeTable('manuscripts');
        console.log('\nManuscript table new columns:');
        console.log('  - manuscript_type:', manuscriptDescription.manuscript_type ? '✓' : '✗');
        console.log('  - cover_letter_path:', manuscriptDescription.cover_letter_path ? '✓' : '✗');
        console.log('  - no_of_words_text:', manuscriptDescription.no_of_words_text ? '✓' : '✗');
        console.log('  - reviewer_designation:', manuscriptDescription.reviewer_designation ? '✓' : '✗');
        console.log('  - reviewer_specialisation:', manuscriptDescription.reviewer_specialisation ? '✓' : '✗');

        // Verify ManuscriptAuthor table
        const manuscriptAuthorDescription = await sequelize.getQueryInterface().describeTable('manuscript_authors');
        console.log('\nManuscriptAuthor table new columns:');
        console.log('  - designation:', manuscriptAuthorDescription.designation ? '✓' : '✗');

        console.log('\n' + '='.repeat(70));
        console.log('✅ SCHEMA UPDATE COMPLETED SUCCESSFULLY');
        console.log('='.repeat(70));

        process.exit(0);
    } catch (error) {
        console.error('\n❌ SCHEMA UPDATE FAILED');
        console.error('Error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

// Run the update
updateSchema();
