/**
 * Quick test to verify /api/manuscripts/submit endpoint
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testSubmitEndpoint() {
    console.log('='.repeat(70));
    console.log('TESTING /api/manuscripts/submit ENDPOINT');
    console.log('='.repeat(70));

    try {
        // Test 1: Check if endpoint exists (should fail with validation error, not 404)
        console.log('\n1. Testing endpoint availability...');

        try {
            await axios.post(`${BASE_URL}/manuscripts/submit`, {});
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    console.log('❌ FAILED: Endpoint returns 404 - Route not found');
                    console.log('   The route is not registered correctly');
                } else {
                    console.log('✅ SUCCESS: Endpoint exists!');
                    console.log(`   Status: ${error.response.status}`);
                    console.log(`   Error: ${error.response.data.error || error.response.data.message}`);
                    console.log('   (This error is expected - we sent empty data)');
                }
            } else {
                console.log('❌ Server not responding:', error.message);
            }
        }

        console.log('\n' + '='.repeat(70));
        console.log('TEST COMPLETE');
        console.log('='.repeat(70));
        console.log('\nNext Steps:');
        console.log('1. If endpoint exists: Test with valid data');
        console.log('2. If 404: Check server logs and route registration');

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

testSubmitEndpoint();
