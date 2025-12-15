const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/manuscripts';

// Use a dummy file for upload
const dummyFilePath = path.join(__dirname, 'dummy_manuscript.txt');
if (!fs.existsSync(dummyFilePath)) {
    fs.writeFileSync(dummyFilePath, 'This is a dummy manuscript file content.');
}

async function runTests() {
    const timestamp = Date.now();
    const uniqueEmail = `testuser_${timestamp}@example.com`;

    console.log('--- Starting Verification ---');
    console.log(`Target Email: ${uniqueEmail}`);

    // TEST 1: Submit New Author (Should Succeed - 201)
    try {
        const form = new FormData();
        form.append('journal', '19'); // Assuming 19 exists from previous data, or 1 if standard
        form.append('name', 'Test User');
        form.append('email', uniqueEmail);
        form.append('phone', '1234567890');
        form.append('paperTitle', `Verification Title ${timestamp}`);
        form.append('manuscriptFile', fs.createReadStream(dummyFilePath));
        // Optional fields
        form.append('wordCount', '1000');
        // authors JSON
        form.append('authors', JSON.stringify([{
            firstName: 'Test',
            lastName: 'User',
            email: uniqueEmail,
            isCorrespondingAuthor: true
        }]));

        console.log('\n[1] Testing New Author Submission...');
        const res = await axios.post(API_URL, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        if (res.status === 201) {
            console.log('✅ Success: Manuscript submitted and author created.');
            console.log('Response:', res.data);
        } else {
            console.log(`❌ Unexpected Status: ${res.status}`);
        }
    } catch (err) {
        console.error('❌ Failed:', err.response ? err.response.data : err.message);
    }

    // TEST 2: Submit Existing Author (Should Fail - 409)
    try {
        const form = new FormData();
        form.append('journal', '19');
        form.append('name', 'Test User');
        form.append('email', uniqueEmail); // EXISTING EMAIL
        form.append('paperTitle', `Verification Title Duplicate`);
        form.append('manuscriptFile', fs.createReadStream(dummyFilePath));

        console.log('\n[2] Testing Existing Author Submission...');
        const res = await axios.post(API_URL, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log(`❌ Failed: Expected 409 but got ${res.status}`);
    } catch (err) {
        if (err.response && err.response.status === 409) {
            console.log('✅ Success: Received expected 409 Conflict.');
            console.log('Error Message:', err.response.data.message);
        } else {
            console.error('❌ Failed: Unexpected error:', err.response ? err.response.data : err.message);
        }
    }

    // CLEANUP
    if (fs.existsSync(dummyFilePath)) {
        fs.unlinkSync(dummyFilePath);
    }
}

// Override console.log to write to file
const logStream = fs.createWriteStream('verify_output.txt');
const originalLog = console.log;
const originalError = console.error;

console.log = function (...args) {
    logStream.write(args.join(' ') + '\n');
    originalLog.apply(console, args);
};
console.error = function (...args) {
    const stringifiedArgs = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg);
    logStream.write('ERROR: ' + stringifiedArgs.join(' ') + '\n');
    originalError.apply(console, stringifiedArgs);
};

runTests();
