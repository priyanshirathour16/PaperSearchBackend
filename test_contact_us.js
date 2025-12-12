const BASE_URL = 'http://localhost:5000/api/contact-us';

async function testContactUs() {
    try {
        console.log('Testing Contact Us API...');

        // Verify fetch availability
        if (typeof fetch === 'undefined') {
            console.error('Fetch API not available. Please run with Node 18+');
            process.exit(1);
        }

        // 1. Create Contact Inquiry
        console.log('\n1. Creating Contact Inquiry...');
        const newContact = {
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            city: 'Test City',
            department: 'Support',
            message: 'This is a test message.'
        };

        let res = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact)
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Create failed: ${res.status} ${err}`);
        }

        const createData = await res.json();
        console.log('Created:', createData);
        const contactId = createData.data.id;

        // 2. Get All Inquiries
        console.log('\n2. Fetching All Inquiries...');
        res = await fetch(BASE_URL);
        const listData = await res.json();
        console.log(`Found ${listData.length} inquiries.`);
        const exists = listData.find(c => c.id === contactId);
        if (exists) {
            console.log('New contact found in list.');
        } else {
            console.error('New contact NOT found in list!');
        }

        // 3. Delete Inquiry
        console.log(`\n3. Deleting Inquiry ID: ${contactId}...`);
        res = await fetch(`${BASE_URL}/${contactId}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Delete failed: ${res.status} ${err}`);
        }

        const deleteData = await res.json();
        console.log('Delete Response:', deleteData);

        // 4. Verify Deletion
        console.log('\n4. Verifying Deletion...');
        res = await fetch(BASE_URL);
        const listAfter = await res.json();
        const existsAfter = listAfter.find(c => c.id === contactId);
        if (!existsAfter) {
            console.log('Contact successfully deleted (soft delete).');
        } else {
            console.error('Contact STILL exists in list!');
        }

    } catch (error) {
        console.error('Error during test:', error.message);
    }
}

testContactUs();
