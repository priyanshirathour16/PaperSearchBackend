const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Publication, Journal, JournalIssue } = require('./src/models');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let publicationId = '';
let journalId = '';
let issueId = '';

async function loginAdmin() {
    try {
        console.log('Logging in as Admin...');
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@gmail.com',
            password: 'admin@123'
        });
        authToken = response.data.token;
        console.log('✅ Admin logged in successfully');
    } catch (error) {
        console.error('❌ Login failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

async function getValidForeignKeys() {
    try {
        const journal = await Journal.findOne();
        if (journal) {
            journalId = journal.id;
        } else {
            // Create a dummy journal if none exists
            const newJournal = await Journal.create({
                title: 'Test Journal',
                category_id: 1, // Assumption: Category 1 exists or is not enforced strictly
                journal_key: 'TJ',
                abbreviation: 'TJ',
                frequency: 'Monthly',
                issn: '1234-5678',
                start_year: 2024,
                email: 'test@test.com',
                description: 'Test',
                scope: 'Test',
                print_version: true,
                online_version: true,
                status: 'Active',
                logo_path: 'logo.png',
                cover_image_path: 'cover.png'
            });
            journalId = newJournal.id;
            console.log('Created new Test Journal');
        }

        const issue = await JournalIssue.findOne({ where: { journal_id: journalId } });
        if (issue) {
            issueId = issue.id;
        } else {
            const newIssue = await JournalIssue.create({
                journal_id: journalId,
                volume: 'Test Vol',
                issue_no: 'Test Issue',
                year: 2024
            });
            issueId = newIssue.id;
            console.log('Created new Test Issue');
        }
        console.log(`Using Journal ID: ${journalId}, Issue ID: ${issueId}`);
    } catch (error) {
        console.error('Error fetching FKs:', error);
        // Try creating blindly if fetch fails due to extensive checks
        // But better to exit and fix DB
        process.exit(1);
    }
}

async function updatePublication() {
    try {
        console.log(`Updating publication ${publicationId}...`);
        const FormData = require('form-data');
        const form = new FormData();
        form.append('title', 'Updated Title');

        const response = await axios.put(`${BASE_URL}/publications/${publicationId}`, form, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                ...form.getHeaders()
            }
        });

        if (response.data.data.title === 'Updated Title') {
            console.log('✅ Publication updated successfully');
        } else {
            console.error('❌ Update validation failed');
        }
    } catch (error) {
        console.error('❌ Update failed:', error.response ? error.response.data : error.message);
    }
}

async function deletePublication() {
    try {
        console.log(`Deleting publication ${publicationId}...`);
        const response = await axios.delete(`${BASE_URL}/publications/${publicationId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        console.log('✅ Publication deleted API response success');

        // Verify soft delete in DB
        const pub = await Publication.findByPk(publicationId, { paranoid: false });
        if (pub && pub.deletedAt) {
            console.log('✅ Database verification: Publication is soft deleted');
        } else {
            console.error('❌ Database verification failed: publication not soft deleted');
        }

    } catch (error) {
        console.error('❌ Delete failed:', error.response ? error.response.data : error.message);
    }
}

async function runTests() {
    await loginAdmin();
    await getValidForeignKeys();

    // Create test publication
    const pub = await Publication.create({
        journal_id: journalId,
        issue_id: issueId,
        manuscript_id: 'TEST-001',
        title: 'Original Title',
        author_name: 'Test Author',
        pdf_path: 'uploads/dummy.pdf'
    });
    publicationId = pub.id;
    console.log(`Created test publication via DB: ${publicationId}`);

    await updatePublication();
    await deletePublication();

    // Clean up
    await pub.destroy({ force: true });
    console.log('Cleaned up test record');
    process.exit(0);
}

runTests();
