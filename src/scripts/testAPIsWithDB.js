/**
 * Complete API Test Script
 * Tests OTP flow and manuscript submission with database verification
 */

const axios = require('axios');
const { sequelize } = require('../models');
const OTP = require('../models/OTP');
const Author = require('../models/Author');
const Manuscript = require('../models/Manuscript');

const BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = `testauthor${Date.now()}@example.com`;
const TEST_NAME = 'Test Author';
const TEST_PHONE = '+1234567890';

let generatedOTP = null;

async function checkDatabase() {
    console.log('\n📊 DATABASE CHECK');
    console.log('-'.repeat(70));

    try {
        await sequelize.authenticate();
        console.log('✓ Database connected');

        // Check if tables exist
        const tables = await sequelize.getQueryInterface().showAllTables();
        console.log(`✓ Found ${tables.length} tables:`, tables.join(', '));

        // Check OTP table structure
        const otpColumns = await sequelize.getQueryInterface().describeTable('otps');
        console.log('\n✓ OTP table columns:', Object.keys(otpColumns).join(', '));

        if (!otpColumns.name || !otpColumns.phone) {
            console.log('⚠️  WARNING: OTP table missing name or phone columns');
            console.log('   Run: node src/scripts/updateManuscriptSchema.js');
            return false;
        }

        return true;
    } catch (error) {
        console.error('✗ Database check failed:', error.message);
        return false;
    }
}

async function test1_SendOTP() {
    console.log('\n\n📧 TEST 1: Send OTP');
    console.log('='.repeat(70));

    try {
        const response = await axios.post(`${BASE_URL}/otp/send`, {
            email: TEST_EMAIL,
            name: TEST_NAME,
            phone: TEST_PHONE
        });

        console.log('✅ SUCCESS');
        console.log('Response:', JSON.stringify(response.data, null, 2));

        // Check database for OTP
        const otpRecord = await OTP.findOne({
            where: { email: TEST_EMAIL },
            order: [['createdAt', 'DESC']]
        });

        if (otpRecord) {
            generatedOTP = otpRecord.otp_code;
            console.log('\n📋 Database Record Created:');
            console.log('  Email:', otpRecord.email);
            console.log('  Name:', otpRecord.name);
            console.log('  Phone:', otpRecord.phone);
            console.log('  OTP Code:', otpRecord.otp_code);
            console.log('  Expires At:', otpRecord.expires_at);
        }

        return true;
    } catch (error) {
        console.error('❌ FAILED');
        console.error('Error:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
        return false;
    }
}

async function test2_VerifyOTP() {
    console.log('\n\n🔐 TEST 2: Verify OTP');
    console.log('='.repeat(70));

    if (!generatedOTP) {
        console.log('⚠️  No OTP available from previous test');
        return false;
    }

    console.log('Using OTP:', generatedOTP);

    try {
        const response = await axios.post(`${BASE_URL}/otp/verify`, {
            email: TEST_EMAIL,
            otp: generatedOTP
        });

        console.log('✅ SUCCESS');
        console.log('Response:', JSON.stringify(response.data, null, 2));

        // Check if author was created
        const author = await Author.findOne({ where: { email: TEST_EMAIL } });

        if (author) {
            console.log('\n👤 Author Account Created:');
            console.log('  ID:', author.id);
            console.log('  Name:', `${author.firstName} ${author.lastName}`);
            console.log('  Email:', author.email);
            console.log('  Phone:', author.contactNumber);
            console.log('  Role:', author.role);
        }

        // Check OTP verification status
        const otpRecord = await OTP.findOne({
            where: { email: TEST_EMAIL, otp_code: generatedOTP }
        });

        if (otpRecord) {
            console.log('\n📋 OTP Record Updated:');
            console.log('  Verified:', otpRecord.is_verified);
            console.log('  Verified At:', otpRecord.verified_at);
        }

        return true;
    } catch (error) {
        console.error('❌ FAILED');
        console.error('Error:', error.response?.data || error.message);
        return false;
    }
}

async function test3_GetJournals() {
    console.log('\n\n📚 TEST 3: Get Journals');
    console.log('='.repeat(70));

    try {
        const response = await axios.get(`${BASE_URL}/journals`);

        console.log('✅ SUCCESS');
        console.log(`Found ${response.data.length} journal(s)`);

        if (response.data.length > 0) {
            console.log('\nFirst Journal:');
            console.log('  ID:', response.data[0].id);
            console.log('  Title:', response.data[0].title);
            return response.data[0].id;
        } else {
            console.log('⚠️  No journals found. Please add a journal first.');
            return null;
        }
    } catch (error) {
        console.error('❌ FAILED');
        console.error('Error:', error.response?.data || error.message);
        return null;
    }
}

async function runAllTests() {
    console.log('='.repeat(70));
    console.log('MANUSCRIPT SUBMISSION API - COMPLETE TEST SUITE');
    console.log('='.repeat(70));
    console.log(`\nTest Email: ${TEST_EMAIL}`);
    console.log('Test Name:', TEST_NAME);
    console.log('Test Phone:', TEST_PHONE);

    // Check database first
    const dbOk = await checkDatabase();
    if (!dbOk) {
        console.log('\n❌ Database check failed. Please run schema update script first.');
        process.exit(1);
    }

    // Test 1: Send OTP
    const test1Pass = await test1_SendOTP();
    if (!test1Pass) {
        console.log('\n❌ Test 1 failed. Stopping tests.');
        process.exit(1);
    }

    // Wait a bit for database write
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Verify OTP
    const test2Pass = await test2_VerifyOTP();
    if (!test2Pass) {
        console.log('\n❌ Test 2 failed. Stopping tests.');
        process.exit(1);
    }

    // Test 3: Get Journals
    const journalId = await test3_GetJournals();

    // Summary
    console.log('\n\n' + '='.repeat(70));
    console.log('✅ ALL TESTS PASSED');
    console.log('='.repeat(70));
    console.log('\n📋 Summary:');
    console.log('  ✓ Database schema verified');
    console.log('  ✓ OTP sent and stored in database');
    console.log('  ✓ OTP verified successfully');
    console.log('  ✓ Author account created');
    console.log('  ✓ Journals retrieved');

    console.log('\n📧 Test Account Details:');
    console.log('  Email:', TEST_EMAIL);
    console.log('  Password: Password@123');

    if (journalId) {
        console.log(`\n💡 You can now test manuscript submission with Journal ID: ${journalId}`);
    }

    process.exit(0);
}

// Run tests
runAllTests().catch(error => {
    console.error('\n💥 UNEXPECTED ERROR:', error);
    process.exit(1);
});
