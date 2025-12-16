const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPIs() {
    console.log('='.repeat(70));
    console.log('TESTING MANUSCRIPT SUBMISSION APIs');
    console.log('='.repeat(70));

    try {
        // Test 1: Send OTP
        console.log('\n📧 TEST 1: Send OTP');
        console.log('-'.repeat(70));

        const otpSendData = {
            email: 'test.author@example.com',
            name: 'Test Author',
            phone: '+1234567890'
        };

        console.log('Request:', JSON.stringify(otpSendData, null, 2));

        const otpResponse = await axios.post(`${BASE_URL}/otp/send`, otpSendData);

        console.log('✅ SUCCESS');
        console.log('Response:', JSON.stringify(otpResponse.data, null, 2));

        // Test 2: Verify OTP (you'll need to check email or server console for OTP)
        console.log('\n🔐 TEST 2: Verify OTP');
        console.log('-'.repeat(70));
        console.log('⚠️  Check your email or server console for the OTP code');
        console.log('The OTP will be a 6-digit number');
        console.log('\nTo complete this test, run:');
        console.log(`curl -X POST ${BASE_URL}/otp/verify -H "Content-Type: application/json" -d "{\\"email\\":\\"test.author@example.com\\",\\"otp\\":\\"YOUR_OTP_HERE\\"}"`);

        console.log('\n' + '='.repeat(70));
        console.log('✅ OTP SEND TEST COMPLETED');
        console.log('='.repeat(70));
        console.log('\nNext Steps:');
        console.log('1. Check server console or email for OTP');
        console.log('2. Verify OTP using the curl command above');
        console.log('3. After verification, author account will be created');
        console.log('4. Welcome email with credentials will be sent');

    } catch (error) {
        console.error('\n❌ TEST FAILED');
        console.error('Error:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Full response:', JSON.stringify(error.response.data, null, 2));
        }
        console.error('\nTroubleshooting:');
        console.error('- Make sure server is running on port 5000');
        console.error('- Check if database is synced (restart server if needed)');
        console.error('- Verify email service configuration');
    }
}

// Run tests
testAPIs();
