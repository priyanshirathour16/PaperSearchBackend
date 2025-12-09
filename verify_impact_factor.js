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
                    resolve({ statusCode: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function verify() {
    try {
        console.log('--- Verifying Impact Factor API ---');
        const now = Date.now();

        // 1. Login
        const loginRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'admin@gmail.com', password: 'admin@123' });
        const token = loginRes.body.token;

        // 1.1 Create Category
        const catRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-categories',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, { title: 'Impact Test Cat ' + now, route: 'impact-test-' + now, status: true });

        const categoryId = catRes.body.id || 1;
        console.log(`Created Category ID: ${categoryId}`);

        // 2. Create Journal
        const journalTitle = 'Impact Factor Test Journal ' + now;
        const jourRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journals',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, {
            title: journalTitle,
            category_id: categoryId,
            print_issn: '1234-5678',
            frequency: 'Annual',
            editorial_board: [{ name: 'Test', position: 'Chief' }]
        });

        const journalId = jourRes.body.id;
        console.log(`Created Journal ID: ${journalId}`);

        if (!journalId) {
            console.error('FAILURE: Jounal Creation Failed or ID missing');
            console.error('Body:', JSON.stringify(jourRes.body));
            return;
        }

        // 3. Add Impact Factors
        console.log('Adding Impact Factors...');
        const addRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-impact-factors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, {
            journal_id: journalId,
            factors: [
                { year: 2023, impact_factor: 2.55 },
                { year: 2022, impact_factor: 2.15 }
            ]
        });

        if (addRes.statusCode === 201) {
            console.log('SUCCESS: Impact Factors added.');
            console.log('Data:', addRes.body.data.length);
        } else {
            console.error('FAILURE: Could not add impact factors.');
            if (addRes.body.errors && addRes.body.errors.length > 0) {
                console.error('Error Msg:', addRes.body.errors[0].msg);
            } else {
                console.error('Body:', JSON.stringify(addRes.body));
            }
            return;
        }

        const factorId = addRes.body.data[0].id;

        // 4. Fetch
        console.log('Fetching Factors...');
        const fetchRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/journal-impact-factors/${journalId}`,
            method: 'GET'
        });

        if (fetchRes.body.length === 2) {
            console.log('SUCCESS: Fetched 2 factors.');
        } else {
            console.error('FAILURE: Expected 2 factors, got ' + fetchRes.body.length);
        }

        // 5. Delete
        console.log(`Deleting Factor ID: ${factorId}...`);
        const delRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/journal-impact-factors/${factorId}`,
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (delRes.statusCode === 200) {
            console.log('SUCCESS: Deleted.');
        } else {
            console.error('FAILURE: Delete failed.', delRes.body);
        }

        // 6. Fetch again
        const fetchRes2 = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/journal-impact-factors/${journalId}`,
            method: 'GET'
        });

        if (fetchRes2.body.length === 1) {
            console.log('SUCCESS: Fetched 1 factor (Soft Delete worked).');
        } else {
            console.error('FAILURE: Expected 1 factor, got ' + fetchRes2.body.length);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

verify();
