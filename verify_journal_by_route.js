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
        console.log('--- Verifying Journal By Category Route ---');

        // 1. Data Setup (Login -> Create Category -> Create Journal)
        console.log('Setting up data...');
        const loginRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'admin@gmail.com', password: 'admin@123' });
        const token = loginRes.body.token;

        const catRoute = 'route-test-' + Date.now();
        const catRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-categories',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, { title: catRoute.replace(/-/g, ' ') }); // Title generates route
        const catId = catRes.body.id;
        const generatedRoute = catRes.body.route;

        console.log(`Created Category Route: ${generatedRoute}`);

        await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journals',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, {
            title: 'Journal For Route Test',
            category_id: catId,
            print_issn: '9999-8888',
            frequency: 'Annual',
            editorial_board: [{ name: 'Route Editor', position: 'Editor in Chief' }]
        });

        // 2. Call API
        console.log('Calling POST /api/journals/details-by-category...');
        const apiRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journals/details-by-category',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { route: generatedRoute });

        if (apiRes.statusCode !== 200) {
            console.error('API Failed:', apiRes.statusCode, apiRes.body);
            return;
        }

        // 3. Verify format
        const data = apiRes.body;
        console.log('Response Title:', data.title);
        console.log('Response Stats:', data.stats);

        if (data.stats && data.impactFactors && data.about && data.keyAudiences && data.editorialBoard) {
            console.log('SUCCESS: Response structure matches requested format.');
        } else {
            console.error('FAILURE: Response missing required fields.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

verify();
