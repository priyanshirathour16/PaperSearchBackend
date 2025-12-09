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

async function verifyEditorAppDelete() {
    try {
        console.log('--- Editor Application Delete Verification ---');

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
            console.error('Login failed', loginRes.body);
            return;
        }
        const token = loginRes.body.token;
        console.log('Login successful.');

        // 2. Fetch all applications to find one to delete (or create one if needed, but lets try fetching first)
        let listRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/editor-applications',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!Array.isArray(listRes.body)) {
            console.error('Failed to list applications');
            return;
        }

        let appIdToDelete;
        if (listRes.body.length > 0) {
            appIdToDelete = listRes.body[0].id; // Just pick the first one
            console.log(`Found application to delete: ID ${appIdToDelete}`);
        } else {
            console.log('No applications found. Please create one manually or via UI first. Skipping delete test.');
            // Ideally I should create one here via API but it involves file upload (multipart/form-data)
            // which is complex to script with native http module.
            // I'll skip create step or assume user has one. user didn't ask to create.
            // "make a soft delect for editor" implies existing ones.
            return;
        }

        // 3. Delete
        console.log(`Deleting application ID ${appIdToDelete}...`);
        const deleteRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/editor-applications/${appIdToDelete}`,
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (deleteRes.statusCode === 200) {
            console.log('Delete successful.');
        } else {
            console.error('Delete failed:', deleteRes.statusCode, deleteRes.body);
            return;
        }

        // 4. Verify absence
        console.log('Verifying absence...');
        listRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/editor-applications',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const found = listRes.body.find(app => app.id === appIdToDelete);
        if (!found) {
            console.log('SUCCESS: Application soft deleted (not found in list).');
        } else {
            console.error('FAILURE: Application still found in list.');
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
}

verifyEditorAppDelete();
