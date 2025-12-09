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
        console.log('--- Verifying Category with Journals API ---');

        // 1. Login (for setup)
        console.log('Logging in...');
        const loginRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'admin@gmail.com', password: 'admin@123' });

        if (loginRes.statusCode !== 200) {
            console.error('Login failed', loginRes.body);
            return;
        }
        const token = loginRes.body.token;

        // 2. Create Category
        const catTitle = 'CatWithJ ' + Date.now();
        console.log(`Creating Category: ${catTitle}`);
        const catRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-categories',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, { title: catTitle });

        const catId = catRes.body.id;
        console.log(`Category Created ID: ${catId}`);

        // 3. Create Journal linked to Category
        const jourTitle = 'Journal In Cat ' + Date.now();
        console.log(`Creating Journal: ${jourTitle}`);
        const jourRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journals',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, {
            title: jourTitle,
            category_id: catId,
            print_issn: '1111-1111',
            e_issn: '2222-2222',
            frequency: 'Monthly',
            editorial_board: [{ name: 'Editor 1', position: 'Editor in Chief' }]
        });

        console.log('Journal Create Status:', jourRes.statusCode);
        console.log('Journal Create Body:', JSON.stringify(jourRes.body, null, 2));

        if (jourRes.statusCode !== 201) {
            console.error('Journal Create Failed');
            return;
        }

        // 4. Call new API
        console.log('Calling GET /api/journal-categories/with-journals...');
        const apiRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-categories/with-journals',
            method: 'GET'
        });

        if (apiRes.statusCode !== 200) {
            console.error('API Call Failed:', apiRes.statusCode, apiRes.body);
            return;
        }

        // 5. Verify Response
        const categories = apiRes.body;
        if (!Array.isArray(categories)) {
            console.error('Response is not an array.');
            return;
        }

        const targetCat = categories.find(c => c.id === catId);
        if (targetCat) {
            console.log('Found created category in response.');
            if (targetCat.journals && Array.isArray(targetCat.journals)) {
                console.log(`Category has ${targetCat.journals.length} journals.`);
                console.log('Journals in category:', JSON.stringify(targetCat.journals, null, 2));
                const targetJour = targetCat.journals.find(j => j.title === jourTitle);
                if (targetJour) {
                    console.log('Found created journal in category.');
                    console.log('Journal details:', targetJour);
                    if (targetJour.print_issn === '1111-1111' && targetJour.e_issn === '2222-2222') {
                        console.log('SUCCESS: Journal contains requested fields (ISSNs).');
                    } else {
                        console.error('FAILURE: Journal missing correct ISSNs.');
                    }
                } else {
                    console.error('FAILURE: Created journal not found in category journals list.');
                }
            } else {
                console.error('FAILURE: Category does not have journals array.');
            }
        } else {
            console.error('FAILURE: Created category not found in response.');
        }

    } catch (error) {
        console.error('Verification Error:', error);
    }
}

verify();
