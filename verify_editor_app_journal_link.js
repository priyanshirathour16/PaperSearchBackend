const http = require('http');

function request(options, data, headers = {}) {
    return new Promise((resolve, reject) => {
        const req = http.request({ ...options, headers: { ...options.headers, ...headers } }, (res) => {
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
        if (data) req.write(data);
        req.end();
    });
}

function createMultipartBody(fields, boundary) {
    let body = '';
    for (const [key, value] of Object.entries(fields)) {
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
        body += `${value}\r\n`;
    }
    body += `--${boundary}--\r\n`;
    return body;
}

async function verify() {
    try {
        console.log('--- Verifying Editor Application Journal Link (Multipart) ---');

        const now = Date.now();
        const email = `editor${now}@test.com`;
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

        // 1. Login
        const loginRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, JSON.stringify({ email: 'admin@gmail.com', password: 'admin@123' }));
        const token = loginRes.body.token;

        // 2. Create Journal
        const journalTitle = `Journal For Editor ${now}`;
        const jourRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journals',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, JSON.stringify({
            title: journalTitle,
            category_id: 1,
            print_issn: '1111-2222',
            frequency: 'Annual',
            editorial_board: [{ name: 'Test', position: 'Chief' }]
        }));

        const journalId = jourRes.body.id || 1; // Fallback if creation returns oddly
        console.log(`Created Journal ID: ${journalId}`);

        // 3. Submit Application Multipart
        const formData = {
            journal: journalId,
            firstName: 'Test',
            lastName: 'Editor',
            email: email,
            password: 'password123',
            confirmPassword: 'password123',
            confirmEmail: email
        };

        const multipartBody = createMultipartBody(formData, boundary);

        console.log('Submitting Application...');
        const subRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/editor-applications',
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': Buffer.byteLength(multipartBody)
            }
        }, multipartBody);

        if (subRes.statusCode !== 201) {
            console.error('Submission Failed:', subRes.statusCode, subRes.body);
            // Don't return, check list anyway to see if partial
        }

        // 4. Fetch
        console.log('Fetching Applications...');
        const listRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/editor-applications',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const app = listRes.body.find ? listRes.body.find(a => a.email === email) : null;
        if (app) {
            console.log('Found Application:', app.id);
            console.log('Journal Field in Response:', app.journal);
            if (app.journal === journalTitle) {
                console.log('SUCCESS: Journal Title matches.');
            } else {
                console.error(`FAILURE: Expected '${journalTitle}', got '${app.journal}'`);
            }
        } else {
            console.error('FAILURE: Application not found.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

verify();
