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
        console.log('Login successful.');

        console.log('Fetching Authors...');
        const authorsRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/authors',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (authorsRes.body.length > 0) {
            const author = authorsRes.body[0];
            if (author.password) console.error('FAIL: Author password present!');
            else console.log('PASS: Author password excluded.');
            console.log('Author fields:', Object.keys(author));
        } else {
            console.log('No authors found to check.');
        }

        console.log('Fetching Editor Applications...');
        const editorAppsRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/editor-applications',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (Array.isArray(editorAppsRes.body) && editorAppsRes.body.length > 0) {
            const app = editorAppsRes.body[0];
            if (app.password) console.error('FAIL: Editor App password present!');
            else console.log('PASS: Editor App password excluded.');
            console.log('Editor App fields:', Object.keys(app));
        } else {
            console.log('No editor applications found to check.');
        }

    } catch (err) {
        console.error('Verification failed:', err);
    }
}

verify();
