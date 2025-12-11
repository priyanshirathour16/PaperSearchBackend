const http = require('http');
const fs = require('fs');

const LOG_FILE = 'verify_get_log.txt';

function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + '\n');
    console.log(msg);
}

function request(options, bodyBuffer, headers = {}) {
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
        req.on('error', (err) => {
            log('Request Error: ' + err.message);
            reject(err);
        });
        if (bodyBuffer) req.write(bodyBuffer);
        req.end();
    });
}

function login() {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed.token);
                } catch (e) {
                    resolve(null);
                }
            });
        });
        req.write(JSON.stringify({ email: 'admin@gmail.com', password: 'admin@123' }));
        req.end();
    });
}

async function verify() {
    try {
        fs.writeFileSync(LOG_FILE, '');
        log('--- Verifying Manuscript GET APIs ---');

        const token = await login();
        if (!token) {
            log('Login Failed');
            return;
        }

        // 1. Get All Manuscripts
        log('Testing List API: GET /api/manuscripts');
        const listRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/manuscripts',
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        log('List Status: ' + listRes.statusCode);

        if (listRes.statusCode !== 200 || !listRes.body.data || listRes.body.data.length === 0) {
            log('List API Failed or Empty. Cannot proceed to Detail test.');
            log('Body: ' + JSON.stringify(listRes.body));
            return;
        }

        const firstManuscript = listRes.body.data[0];
        log('First Manuscript Public ID: ' + firstManuscript.manuscript_id);
        log('Has Journal Title? ' + (firstManuscript.journal && firstManuscript.journal.title ? 'Yes' : 'No'));

        // 2. Get Details
        const publicId = firstManuscript.manuscript_id;
        log('Testing Detail API: GET /api/manuscripts/' + publicId);

        const detailRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/manuscripts/' + publicId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        log('Detail Status: ' + detailRes.statusCode);
        const details = detailRes.body.data;

        if (detailRes.statusCode === 200 && details) {
            log('Has Authors? ' + (details.authors && details.authors.length > 0 ? 'Yes: ' + details.authors.length : 'No'));
            log('Has Journal ISSN? ' + (details.journal && details.journal.print_issn ? 'Yes' : 'No'));
        } else {
            log('Detail API Failed');
            log('Body: ' + JSON.stringify(detailRes.body));
        }

    } catch (error) {
        log('Error: ' + error.message);
    }
}

verify();
