const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testEmail = 'test.author@example.com';
const testName = 'Test Author';
const testPhone = '+1234567890';

async function testOTPFlow() {
    console.log('='.repeat(60));
    console.log('TESTING OTP FLOW');
    console.log('='.repeat(60));

    try {
        // Step 1: Send OTP
        console.log('\n1. Sending OTP to email:', testEmail);
        const sendResponse = await axios.post(`${BASE_URL}/otp/send`, {
            email: testEmail,
            name: testName,
            phone: testPhone
        });

        console.log('✓ OTP sent successfully');
        console.log('Response:', JSON.stringify(sendResponse.data, null, 2));

        // Prompt for OTP (in real scenario, user would check their email)
        console.log('\n⚠ Please check the email and enter the OTP code');
        console.log('Note: In development, check the server console for the OTP');

        // For testing, we'll wait for user input
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('\nEnter the OTP code: ', async (otpCode) => {
            try {
                // Step 2: Verify OTP
                console.log('\n2. Verifying OTP:', otpCode);
                const verifyResponse = await axios.post(`${BASE_URL}/otp/verify`, {
                    email: testEmail,
                    otp: otpCode
                });

                console.log('✓ OTP verified successfully');
                console.log('Response:', JSON.stringify(verifyResponse.data, null, 2));

                if (verifyResponse.data.authorCreated) {
                    console.log('\n✓ Author account created successfully');
                    console.log('Temporary password:', verifyResponse.data.tempPassword);
                    console.log('Check email for welcome message with credentials');
                } else {
                    console.log('\n✓ Existing author account found');
                }

                // Step 3: Test invalid OTP
                console.log('\n3. Testing invalid OTP (should fail)');
                try {
                    await axios.post(`${BASE_URL}/otp/verify`, {
                        email: testEmail,
                        otp: '000000'
                    });
                } catch (error) {
                    console.log('✓ Invalid OTP rejected as expected');
                    console.log('Error response:', error.response?.data);
                }

                console.log('\n' + '='.repeat(60));
                console.log('OTP FLOW TEST COMPLETED SUCCESSFULLY');
                console.log('='.repeat(60));

            } catch (error) {
                console.error('\n✗ OTP verification failed');
                console.error('Error:', error.response?.data || error.message);
            } finally {
                readline.close();
            }
        });

    } catch (error) {
        console.error('\n✗ OTP sending failed');
        console.error('Error:', error.response?.data || error.message);
        console.error('\nMake sure the server is running on port 5000');
    }
}

// Run the test
testOTPFlow();
