const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function verifyOrganizerLogo() {
    console.log('Verifying Organizer Logo Upload...');
    const url = 'http://localhost:5000/api/conferences/template';

    // Ensure we have a dummy image to upload
    const dummyImagePath = 'dummy_logo.jpg';
    if (!fs.existsSync(dummyImagePath)) {
        fs.writeFileSync(dummyImagePath, 'dummy content');
    }

    const form = new FormData();
    form.append('conference_id', '1'); // Assuming conference with ID 1 exists
    form.append('description', 'Test Description');
    form.append('organizer_logo', fs.createReadStream(dummyImagePath));

    try {
        console.log('Sending request...');
        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        if (response.data && response.data.success) {
            const template = response.data.success;
            console.log('Created/Updated Template:', template);

            if (template.organizer_logo) {
                console.log('✅ VERIFICATION SUCCESS: organized_logo was handled.');
            } else {
                console.log('❌ VERIFICATION FAILED: organized_logo is missing in response.');
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
    } finally {
        // Cleanup
        if (fs.existsSync(dummyImagePath)) {
            fs.unlinkSync(dummyImagePath);
        }
    }
}

verifyOrganizerLogo();
