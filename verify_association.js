const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = body ? JSON.parse(body) : {};
                    resolve({ statusCode: res.statusCode, body: parsed });
                } catch (e) {
                    console.error('JSON Parse Error:', body);
                    resolve({ statusCode: res.statusCode, body: body });
                }
            });
        });
        req.on('error', (err) => {
            console.error('Request Error:', err);
            reject(err);
        });
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function verifyAssociation() {
    try {
        console.log('--- Starting Association Verification (Simplified) ---');

        // 1. Login
        console.log('Logging in...');
        const loginRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'admin@gmail.com', password: 'admin@123' });

        if (loginRes.statusCode !== 200) {
            console.error('Login failed:', loginRes.body);
            return;
        }
        const token = loginRes.body.token;
        console.log('Login successful.');

        // 2. Create Category
        const catTitle = 'AssocTest Cat ' + Date.now();
        console.log(`Creating category "${catTitle}"...`);
        const catRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-categories',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, { title: catTitle });

        if (catRes.statusCode !== 201) {
            console.error('Create Category Failed:', catRes.body);
            return;
        }
        const categoryId = catRes.body.id;
        console.log(`Category created: ID ${categoryId}`);

        // 3. Create Journal with Category
        const journalTitle = 'AssocTest Journal ' + Date.now();
        console.log(`Creating journal "${journalTitle}"...`);
        const journalRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journals',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, {
            title: journalTitle,
            category_id: categoryId,
            frequency: 'Monthly',
            editorial_board: [{ name: 'Editor 1', position: 'Editor in Chief' }]
        });

        if (journalRes.statusCode !== 201) {
            console.error('Create Journal Failed:', journalRes.body);
            return;
        }
        console.log('Journal created successfully.');
        const journalId = journalRes.body.id;

        if (journalRes.body.category_id === categoryId) {
            console.log('SUCCESS: Journal creation response contains correct category_id.');
        } else {
            console.error('FAILURE: category_id mismatch in create response.');
        }

        // 4. Fetch All Journals
        console.log('Fetching all journals...');
        const listRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journals',
            method: 'GET',
        });

        if (Array.isArray(listRes.body)) {
            const found = listRes.body.find(j => j.title === journalTitle); // Match by title to be safe
            if (found) {
                console.log('Found created journal in list.');
                // Check if 'category' object is present
                if (found.category && found.category.id === categoryId) {
                    console.log('SUCCESS: Journal in list has correct "category" association.');
                } else {
                    console.error('FAILURE: "category" association missing or incorrect in list response.', found.category);
                }
            } else {
                console.error('FAILURE: Created journal not found in list.');
            }
        } else {
            console.error('FAILURE: GET /api/journals did not return an array.', listRes.body);
        }

    } catch (error) {
        console.error('Script Verification Crash:', error);
    }
}

verifyAssociation();
