const axios = require('axios');

async function verifyConferenceFields() {
    console.log('Verifying Conference Fields Persistence...');
    const url = 'http://localhost:5000/api/conferences';
    const payload = {
        name: `Test Conference ${Date.now()}`,
        organized_by: "Test Organizer",
        start_date: "2025-12-26"
    };

    try {
        console.log('Sending payload:', payload);
        const response = await axios.post(url, payload);

        if (response.data && response.data.success) {
            const created = response.data.success;
            console.log('Created Conference:', created);

            if (created.organized_by === payload.organized_by && created.start_date === payload.start_date) {
                console.log('✅ VERIFICATION SUCCESS: Fields persisted correctly.');
            } else {
                console.log('❌ VERIFICATION FAILED: Fields mismatch.');
                console.log('Expected:', payload.organized_by, payload.start_date);
                console.log('Actual:', created.organized_by, created.start_date);
            }
        } else {
            console.log('❌ VERIFICATION FAILED: Unexpected response format', response.data);
        }
    } catch (error) {
        console.error('❌ VERIFICATION FAILED: Request error');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

verifyConferenceFields();
