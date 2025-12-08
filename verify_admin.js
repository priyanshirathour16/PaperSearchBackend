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

async function verify() {
    try {
        console.log('Logging in as admin...');
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
        console.log('Login successful. Token acquired.');

        console.log('Fetching Authors...');
        const authorsRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/authors',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`Authors Status: ${authorsRes.statusCode}`, authorsRes.body.length > 0 ? 'Found authors' : 'No authors');

        console.log('Fetching Editor Applications...');
        const editorAppsRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/editor-applications',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`Editor Apps Status: ${editorAppsRes.statusCode}`, Array.isArray(editorAppsRes.body) ? 'Found apps' : 'Error');

    } catch (err) {
        console.error('Verification failed:', err);
    }
}

verify();
