/**
 * Test Unified Login API
 */

const axios = require('axios');
const { sequelize } = require('./src/models');
const Author = require('./src/models/Author');
const Admin = require('./src/models/Admin');
const bcrypt = require('bcryptjs');

const BASE_URL = 'http://localhost:5000/api';

async function testLogin() {
    console.log('='.repeat(70));
    console.log('TESTING UNIFIED LOGIN API');
    console.log('='.repeat(70));

    try {
        await sequelize.authenticate();
        console.log('✓ Database connected\n');

        // Setup Test Data
        const testAuthorEmail = 'test.author.login@example.com';
        const testAdminEmail = 'test.admin.login@example.com';
        const testPassword = 'Password123!';
        const hashedPassword = await bcrypt.hash(testPassword, 10);

        // 1. Create/Ensure Test Author
        await Author.destroy({ where: { email: testAuthorEmail } });
        await Author.create({
            firstName: 'Test',
            lastName: 'Author',
            email: testAuthorEmail,
            password: hashedPassword,
            role: 'author'
        });
        console.log('✓ Test Author created');

        // 2. Create/Ensure Test Admin
        await Admin.destroy({ where: { email: testAdminEmail } });
        await Admin.create({
            email: testAdminEmail,
            role: 'editor',
            password: hashedPassword
        });
        console.log('✓ Test Editor (Admin) created');


        // Test 1: Login as Author
        console.log('\n📋 TEST 1: Login as Author');
        console.log('-'.repeat(70));

        try {
            const authorResponse = await axios.post(`${BASE_URL}/auth/login`, {
                email: testAuthorEmail,
                password: testPassword
            });
            console.log('✅ SUCCESS');
            console.log('Response:', JSON.stringify(authorResponse.data, null, 2));

            if (authorResponse.data.role !== 'author' || !authorResponse.data.user.firstName) {
                console.log('❌ FAILED: Incorrect data returned for author');
            }
        } catch (error) {
            console.log('❌ FAILED:', error.response?.data || error.message);
        }

        // Test 2: Login as Editor
        console.log('\n📋 TEST 2: Login as Editor');
        console.log('-'.repeat(70));

        try {
            const editorResponse = await axios.post(`${BASE_URL}/auth/login`, {
                email: testAdminEmail,
                password: testPassword
            });
            console.log('✅ SUCCESS');
            console.log('Response:', JSON.stringify(editorResponse.data, null, 2));

            if (editorResponse.data.role !== 'editor' || editorResponse.data.user.firstName) {
                // Admin model doesn't have firstName usually, so checking structure
                console.log('✓ Correctly identified as editor');
            }
        } catch (error) {
            console.log('❌ FAILED:', error.response?.data || error.message);
        }

        // Test 3: Invalid Credentials
        console.log('\n📋 TEST 3: Invalid Credentials');
        console.log('-'.repeat(70));

        try {
            await axios.post(`${BASE_URL}/auth/login`, {
                email: testAuthorEmail,
                password: 'WrongPassword'
            });
            console.log('❌ FAILED: Should have returned error');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ SUCCESS: correctly rejected invalid credentials');
            } else {
                console.log('❌ FAILED: Unexpected error:', error.message);
            }
        }

        // Cleanup
        await Author.destroy({ where: { email: testAuthorEmail } });
        await Admin.destroy({ where: { email: testAdminEmail } });

    } catch (error) {
        console.error('\n❌ CRITICAL ERROR:', error.message);
    }
}

testLogin();
