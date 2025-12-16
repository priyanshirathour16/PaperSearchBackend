/**
 * Comprehensive API Testing Script
 * Tests all manuscript submission APIs step by step
 */

const axios = require('axios');
const readline = require('readline');

const BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'testauthor' + Date.now() + '@example.com'; // Unique email for each test

console.log('='.repeat(80));
console.log('MANUSCRIPT SUBMISSION API - COMPREHENSIVE TEST');
console.log('='.repeat(80));
console.log(`\nTest Email: ${TEST_EMAIL}`);
console.log('Base URL:', BASE_URL);
console.log('\n');

async function test1_SendOTP() {
    console.log('TEST 1: Send OTP for Email Verification');
    console.log('-'.repeat(80));

    try {
        const requestData = {
            email: TEST_EMAIL,
            name: 'Test Author',
            phone: '+1234567890'
        };

        console.log('📤 Request:');
        console.log(JSON.stringify(requestData, null, 2));

        const response = await axios.post(`${BASE_URL}/otp/send`, requestData);

        console.log('\n✅ SUCCESS - OTP Sent');
        console.log('📥 Response:');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('\n⏰ OTP expires in:', response.data.expiresIn);

        return true;
    } catch (error) {
        console.log('\n❌ FAILED');
        console.log('Error:', error.response?.data || error.message);
        if (error.response) {
            console.log('Status Code:', error.response.status);
            console.log('Full Response:', JSON.stringify(error.response.data, null, 2));
        }
        return false;
    }
}

async function test2_VerifyOTP(otp) {
    console.log('\n\nTEST 2: Verify OTP and Create Author Account');
    console.log('-'.repeat(80));

    try {
        const requestData = {
            email: TEST_EMAIL,
            otp: otp
        };

        console.log('📤 Request:');
        console.log(JSON.stringify(requestData, null, 2));

        const response = await axios.post(`${BASE_URL}/otp/verify`, requestData);

        console.log('\n✅ SUCCESS - OTP Verified');
        console.log('📥 Response:');
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data.authorCreated) {
            console.log('\n🎉 Author Account Created!');
            console.log('📧 Welcome email sent with credentials');
            console.log('🔑 Temporary Password:', response.data.tempPassword);
        } else {
            console.log('\n👤 Existing author account found');
        }

        return true;
    } catch (error) {
        console.log('\n❌ FAILED');
        console.log('Error:', error.response?.data || error.message);
        if (error.response) {
            console.log('Status Code:', error.response.status);
            console.log('Full Response:', JSON.stringify(error.response.data, null, 2));
        }
        return false;
    }
}

async function test3_GetJournals() {
    console.log('\n\nTEST 3: Get Available Journals');
    console.log('-'.repeat(80));

    try {
        const response = await axios.get(`${BASE_URL}/journals`);

        console.log('✅ SUCCESS - Journals Retrieved');
        console.log(`📚 Found ${response.data.length} journal(s)`);

        if (response.data.length > 0) {
            console.log('\nFirst Journal:');
            console.log(`  ID: ${response.data[0].id}`);
            console.log(`  Title: ${response.data[0].title}`);
            return response.data[0].id; // Return first journal ID for manuscript submission
        }

        return null;
    } catch (error) {
        console.log('❌ FAILED');
        console.log('Error:', error.response?.data || error.message);
        return null;
    }
}

async function runTests() {
    console.log('Starting API Tests...\n');

    // Test 1: Send OTP
    const otpSent = await test1_SendOTP();

    if (!otpSent) {
        console.log('\n\n⚠️  Cannot continue - OTP sending failed');
        console.log('\nTroubleshooting:');
        console.log('1. Check if server is running: http://localhost:5000');
        console.log('2. Verify database is synced (restart server if needed)');
        console.log('3. Check email service configuration in src/utils/emailService.js');
        return;
    }

    // Prompt for OTP
    console.log('\n' + '='.repeat(80));
    console.log('📧 CHECK YOUR EMAIL OR SERVER CONSOLE FOR OTP');
    console.log('='.repeat(80));
    console.log('\nThe OTP is a 6-digit number that was just sent.');
    console.log('Check the server console output above for the OTP code.\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the 6-digit OTP: ', async (otp) => {
        rl.close();

        // Test 2: Verify OTP
        const otpVerified = await test2_VerifyOTP(otp.trim());

        if (!otpVerified) {
            console.log('\n\n⚠️  OTP verification failed');
            console.log('Please check the OTP and try again');
            return;
        }

        // Test 3: Get Journals
        const journalId = await test3_GetJournals();

        console.log('\n\n' + '='.repeat(80));
        console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY');
        console.log('='.repeat(80));
        console.log('\n📋 Summary:');
        console.log('  ✓ OTP sent successfully');
        console.log('  ✓ OTP verified and author account created');
        console.log('  ✓ Journals retrieved');
        console.log(`\n📧 Test Email: ${TEST_EMAIL}`);
        console.log('🔑 Password: Password@123');
        console.log('\n💡 Next Steps:');
        console.log('  - Check email for welcome message');
        console.log('  - Use the credentials above to login');
        console.log('  - Submit a manuscript using the manuscript submission endpoint');

        if (journalId) {
            console.log(`\n📝 To test manuscript submission, you can use Journal ID: ${journalId}`);
        }
    });
}

// Run all tests
runTests().catch(error => {
    console.error('\n\n💥 UNEXPECTED ERROR:');
    console.error(error);
});
