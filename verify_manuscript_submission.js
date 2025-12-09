const http = require('http');
const fs = require('fs');
const path = require('path');

const LOG_FILE = 'verify_log.txt';

function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + '\n');
    console.log(msg);
}

function createMultipartBody(fields, files, boundary) {
    let body = Buffer.alloc(0);

    for (const [key, value] of Object.entries(fields)) {
        body = Buffer.concat([
            body,
            Buffer.from(`--${boundary}\r\n`),
            Buffer.from(`Content-Disposition: form-data; name="${key}"\r\n\r\n`),
            Buffer.from(`${value}\r\n`)
        ]);
    }

    for (const [key, filePath] of Object.entries(files)) {
        const fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath);

        let contentType = 'application/octet-stream';
        if (fileName.endsWith('.png')) contentType = 'image/png';
        if (fileName.endsWith('.jpg')) contentType = 'image/jpeg';

        body = Buffer.concat([
            body,
            Buffer.from(`--${boundary}\r\n`),
            Buffer.from(`Content-Disposition: form-data; name="${key}"; filename="${fileName}"\r\n`),
            Buffer.from(`Content-Type: ${contentType}\r\n\r\n`),
            fileContent,
            Buffer.from(`\r\n`)
        ]);
    }

    body = Buffer.concat([
        body,
        Buffer.from(`--${boundary}--\r\n`)
    ]);

    return body;
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
                    log('Login Parse Error: ' + body);
                    resolve(null);
                }
            });
        });
        req.on('error', (e) => {
            log('Login Network Error: ' + e.message);
            resolve(null);
        });
        req.write(JSON.stringify({ email: 'admin@gmail.com', password: 'admin@123' }));
        req.end();
    });
}

async function createDeps(token, now) {
    try {
        log('Creating Category...');
        const catRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journal-categories',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, JSON.stringify({ title: 'Man Cat ' + now, route: 'man-cat-' + now, status: true }));

        log('Cat Res Code: ' + catRes.statusCode);
        log('Cat Res Body: ' + JSON.stringify(catRes.body));

        const catId = catRes.body.id || (catRes.body.data ? catRes.body.data.id : null);

        if (!catId) {
            log('Category creation failed - No ID');
            return null;
        }

        log('Creating Journal with Cat ID: ' + catId);
        const jourRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/journals',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }, JSON.stringify({
            title: 'Manuscript Test Journal ' + now,
            category_id: catId,
            print_issn: '1234-5678',
            frequency: 'Annual',
            editorial_board: [{ name: 'Test', position: 'Editor in Chief' }]
        }));

        log('Jour Res Code: ' + jourRes.statusCode);
        log('Jour Res Body: ' + JSON.stringify(jourRes.body));

        return jourRes.body.id || (jourRes.body.data ? jourRes.body.data.id : null);
    } catch (e) {
        log('Create Deps Exception: ' + e.message);
        return null;
    }
}

async function verify() {
    try {
        fs.writeFileSync(LOG_FILE, '');
        log('--- Verifying Manuscript Submission ---');
        const now = Date.now();
        const boundary = '----WebKitFormBoundaryTest' + now;

        if (!fs.existsSync('test_manuscript.txt')) fs.writeFileSync('test_manuscript.txt', 'This is a test manuscript content.');
        if (!fs.existsSync('test_signature.png')) fs.writeFileSync('test_signature.png', 'fake png content');

        const token = await login();
        log('Token received: ' + (token ? 'Yes' : 'No'));

        if (!token) {
            return;
        }

        const journalId = await createDeps(token, now);
        log('Created Journal ID: ' + journalId);

        if (!journalId) {
            log('Failed to create journal dependency');
            return;
        }

        const formData = {
            name: 'John Author',
            email: 'john@author.com',
            confirmEmail: 'john@author.com',
            phone: '1234567890',
            journal: journalId,
            paperTitle: 'Test Paper Title ' + now,
            wordCount: '5000',
            pageCount: '20',
            tableCount: '2',
            figureCount: '3',
            revFirstName: 'Reviewer',
            revLastName: 'One',
            revEmail: 'rev1@test.com',
            revPhone: '0987654321',
            revInstitution: 'Test Inst',
            keywords: 'test, api, manuscript',
            abstract: 'This is an abstract.',
            authors: JSON.stringify([
                { firstName: 'John', lastName: 'Author', email: 'john@author.com', isCorrespondingAuthor: true },
                { firstName: 'Jane', lastName: 'CoAuthor', email: 'jane@coauthor.com', isCorrespondingAuthor: false }
            ])
        };

        const files = {
            manuscriptFile: 'test_manuscript.txt',
            signature: 'test_signature.png'
        };

        const multipartBody = createMultipartBody(formData, files, boundary);

        log('Submitting Manuscript...');
        const res = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/manuscripts',
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': multipartBody.length
            }
        }, multipartBody);

        log('Manuscript Res Code: ' + res.statusCode);
        log('Manuscript Res Body: ' + JSON.stringify(res.body));

        if (res.statusCode === 201) {
            log('SUCCESS: Manuscript submitted.');
        } else {
            log('FAILURE');
        }

        if (fs.existsSync('test_manuscript.txt')) fs.unlinkSync('test_manuscript.txt');
        if (fs.existsSync('test_signature.png')) fs.unlinkSync('test_signature.png');

    } catch (error) {
        log('Global Error: ' + error.message);
    }
}

verify();
