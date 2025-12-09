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

async function verifyAssociation() {
    try {
        console.log('--- Starting Association Verification V2 ---');

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
        const catTitle = 'V2 Cat ' + Date.now();
        console.log(`Creating category "${catTitle}"...`);
        const catRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-categories',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }, { title: catTitle });

        const categoryId = catRes.body.id;
        console.log(`Category created: ID ${categoryId}`);

        // 3. Create Journal
        const journalTitle = 'V2 Journal ' + Date.now();
        console.log(`Creating journal "${journalTitle}"...`);
        const journalRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journals',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }, {
            title: journalTitle,
            category_id: categoryId,
            frequency: 'Monthly', // required
            editorial_board: [{ name: 'Editor V2', position: 'Editor in Chief' }] // required validation
        });

        console.log('Create Journal Response Code:', journalRes.statusCode);
        const journalCreated = journalRes.body;

        if (journalCreated.category_id === categoryId) {
            console.log('SUCCESS: category_id matches in Create response.');
        } else {
            console.error('FAILURE: category_id mismatch in Create response.', journalCreated);
        }

        // 4. Fetch All Journals (GET) and check for category object
        console.log('Fetching all journals...');
        const getRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journals',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Get Response Code:', getRes.statusCode);
        if (Array.isArray(getRes.body)) {
            const found = getRes.body.find(j => j.id === journalCreated.id);
            if (found) {
                console.log('Found journal in list.');
                if (found.category && found.category.id === categoryId) {
                    console.log('SUCCESS: Journal has correct "category" object in GET response.');
                } else {
                    console.error('FAILURE: "category" object missing or incorrect.', found);
                }
            } else {
                console.error('FAILURE: Newly created journal not found in list.');
            }
        } else {
            console.error('FAILURE: GET response is not an array.');
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
}

verifyAssociation();
