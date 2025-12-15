const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth'; // Adjust port if needed based on .env or defaults (index.js usually 5001 or 3000)

// Helper delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    console.log('--- Starting OTP Verification ---');

    console.log('\n[1] Testing Send OTP...');
    const testUser = {
        name: 'OTP Test User',
        email: `otp_test_${Date.now()}@example.com`,
        phone: '1234567890'
    };

    let otp = null;

    try {
        const response = await axios.post(`${BASE_URL}/send-otp`, testUser);
        console.log('✅ Success: OTP Sent.');
        console.log('Response:', response.data);
        otp = response.data.otp;
    } catch (error) {
        console.error('❌ Failed to send OTP:', error.response ? error.response.data : error.message);
        return;
    }

    if (!otp) {
        console.error('❌ OTP not received in response (Check dev mode implementation).');
        return;
    }

    console.log('\n[2] Testing Verify & Login (New User)...');
    try {
        const response = await axios.post(`${BASE_URL}/verify-otp-login`, testUser);
        console.log('✅ Success: Login/Register successful.');
        console.log('Token received:', !!response.data.token);
        console.log('Is New User:', response.data.isNewUser);
        console.log('User Role:', response.data.role);
    } catch (error) {
        console.error('❌ Failed to verify/login:', error.response ? error.response.data : error.message);
    }

    console.log('\n[3] Testing Verify & Login (Existing User)...');
    try {
        const response = await axios.post(`${BASE_URL}/verify-otp-login`, testUser);
        console.log('✅ Success: Login successful.');
        console.log('Token received:', !!response.data.token);
        console.log('Is New User:', response.data.isNewUser); // Should be false
    } catch (error) {
        console.error('❌ Failed to verify/login existing:', error.response ? error.response.data : error.message);
    }
}

runTests();
