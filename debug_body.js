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
        console.log('--- Debugging Body Parsing ---');

        // 1. Login
        const loginRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'admin@gmail.com', password: 'admin@123' });
        const token = loginRes.body.token;

        // 2. Call Debug
        const debugRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-impact-factors/debug',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, {
            test: 'value',
            number: 123
        });

        console.log('Status:', debugRes.statusCode);
        console.log('Response:', JSON.stringify(debugRes.body, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

verify();
