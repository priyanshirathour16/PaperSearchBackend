const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, body: body ? JSON.parse(body) : {} });
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function verifyJournalCategory() {
    try {
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
        const testTitle = 'Journal Physics ' + Date.now();
        console.log(`Creating category "${testTitle}"...`);
        const createRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-categories',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }, { title: testTitle });

        let categoryId;
        if (createRes.statusCode === 201) {
            console.log('SUCCESS: Category created.');
            categoryId = createRes.body.id;
        } else {
            console.error('FAILURE: Create failed', createRes.body);
            return;
        }

        // 3. Verify Public Get (Should be present)
        console.log('Fetching categories (expecting presence)...');
        let getRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-categories',
            method: 'GET',
        });

        let found = getRes.body.find(c => c.id === categoryId);
        if (found) console.log('SUCCESS: Category found in list.');
        else console.error('FAILURE: Category not found in list.');

        // 4. Soft Delete
        console.log('Soft deleting category...');
        const deleteRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/journal-categories/${categoryId}`,
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (deleteRes.statusCode === 200) {
            console.log('SUCCESS: Delete request successful.');
        } else {
            console.error('FAILURE: Delete failed', deleteRes.body);
        }

        // 5. Verify Public Get (Should be absent)
        console.log('Fetching categories (expecting absence)...');
        getRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-categories',
            method: 'GET',
        });

        found = getRes.body.find(c => c.id === categoryId);
        if (!found) console.log('SUCCESS: Category NOT found in list (Soft Deleted).');
        else console.error('FAILURE: Category STILL found in list.');

    } catch (error) {
        console.error('Script Error:', error);
    }
}

verifyJournalCategory();
