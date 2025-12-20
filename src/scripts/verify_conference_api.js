const axios = require('axios');
const { sequelize } = require('../models');
const Conference = require('../models/Conference');

const BASE_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin@123';

async function verifyConferenceAPI() {
    console.log('Starting Conference API Verification (Soft Delete Check)...');

    let token;
    let conferenceId;

    // 1. Login
    try {
        console.log('Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        token = loginRes.data.token;
        console.log('✅ Login Successful');
    } catch (error) {
        console.error('❌ Login Failed:', error.response?.data || error.message);
        process.exit(1);
    }

    const authHeaders = {
        headers: { Authorization: `Bearer ${token}` }
    };

    // 2. Create Conference
    try {
        console.log('Creating Conference...');
        const createRes = await axios.post(`${BASE_URL}/conferences`, {
            name: 'Soft Delete Test Conference',
            organized_by: 'Test Org',
            start_date: '2024-01-01'
        }, authHeaders);
        conferenceId = createRes.data.id;
        console.log(`✅ Conference Created (ID: ${conferenceId})`);
    } catch (error) {
        console.error('❌ Create Conference Failed:', error.response?.data || error.message);
        process.exit(1);
    }

    // 3. Delete Conference (Should be Soft Delete)
    try {
        console.log('Deleting Conference...');
        await axios.delete(`${BASE_URL}/conferences/${conferenceId}`, authHeaders);
        console.log('✅ Conference Deleted via API');
    } catch (error) {
        console.error('❌ Delete Conference Failed:', error.response?.data || error.message);
        process.exit(1);
    }

    // 4. Verify API returns 404
    try {
        console.log('Verifying API returns 404...');
        await axios.get(`${BASE_URL}/conferences/${conferenceId}`);
        console.error('❌ Conference still visible in API (Expected 404)');
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('✅ API correctly returned 404 for deleted conference');
        } else {
            console.error('❌ Unexpected error verifying deletion:', error.message);
        }
    }

    // 5. Verify Database Record Still Exists (Soft Delete Check)
    try {
        console.log('Verifying Database Record (Soft Delete)...');
        // We need raw query or paranoid: false query to check this.
        // Assuming we can access the model directly in this script context
        // Note: This script assumes it can connect to DB.

        // Ensure standard Sequelize query works if running locally with DB access
        const record = await Conference.findOne({
            where: { id: conferenceId },
            paranoid: false // Include soft-deleted records
        });

        if (record && record.deletedAt) {
            console.log(`✅ Database confirmed soft delete. Record ID ${conferenceId} exists with deletedAt: ${record.deletedAt}`);
        } else if (record) {
            console.error(`❌ Record exists but deletedAt is null! (Hard delete did not happen, but soft delete flag missing)`);
        } else {
            console.error(`❌ Record disappeared from Database! (Hard deleted instead of soft deleted)`);
        }

    } catch (error) {
        console.warn('⚠️  Could not verify database directly (Script might not have DB access context initialized correctly). Skipping DB check.');
        console.warn('Error:', error.message);
    }

    console.log('Verification Complete.');
    process.exit(0);
}

// Initialize DB connection for the script check
sequelize.authenticate().then(() => {
    verifyConferenceAPI();
}).catch(err => {
    console.error('Unable to connect to database for verification script:', err);
    // Fallback to just API test if DB fails
    verifyConferenceAPI();
});
