const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
let token = '';
let journalId = 1;
let issueId = 1;

async function login() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@gmail.com',
            password: 'admin@123'
        });
        token = response.data.token;
        console.log('Login successful');
    } catch (error) {
        console.error('Login failed:', error.response ? JSON.stringify(error.response.data) : error.message);
        process.exit(1);
    }
}

async function getJournalAndIssueIds() {
    try {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const journalRes = await axios.get(`${BASE_URL}/journals`, config);
        console.log('Fetched Journals Count:', journalRes.data.length);

        for (const journal of journalRes.data) {
            try {
                console.log(`Checking journal ${journal.id}...`);
                const issueRes = await axios.get(`${BASE_URL}/journal-issues/journal/${journal.id}`, config);
                console.log(`Journal ${journal.id} has ${issueRes.data.data.length} issues`);

                if (issueRes.data.data.length > 0) {
                    journalId = journal.id;
                    issueId = issueRes.data.data[0].id;
                    console.log(`Found valid pair - Journal ID: ${journalId}, Issue ID: ${issueId}`);
                    return;
                }
            } catch (e) {
                console.log(`Error checking journal ${journal.id}:`, e.message);
            }
        }

        console.log('No journal with issues found, using defaults');
    } catch (error) {
        console.log('Error fetching IDs:', error.message);
    }
}

async function createPublication() {
    await getJournalAndIssueIds();
    try {
        const form = new FormData();
        form.append('journal_id', journalId);
        form.append('issue_id', issueId);
        form.append('manuscript_id', 'MS-2024-001');
        form.append('title', 'Test Publication Title');
        form.append('author_name', 'Test Author');
        form.append('doi', '10.1234/test.doi');
        form.append('pages', '10-20');
        form.append('author_affiliations', 'Test University');
        form.append('abstract_description', 'This is a test abstract.');
        form.append('abstract_keywords', 'test, publication, api');
        form.append('abstract_references', 'Reference 1, Reference 2');

        const dummyPdfPath = path.join(__dirname, 'test.pdf');
        fs.writeFileSync(dummyPdfPath, 'Dummy PDF content');
        form.append('pdf_file', fs.createReadStream(dummyPdfPath));

        const response = await axios.post(`${BASE_URL}/publications`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Create Publication Response:', response.data);
        fs.unlinkSync(dummyPdfPath);
        return response.data.publication.id;
    } catch (error) {
        console.error('Create Publication Failed:', error.response ? JSON.stringify(error.response.data) : error.message);
    }
}

async function getPublications() {
    try {
        const response = await axios.get(`${BASE_URL}/publications`);
        console.log('Get All Publications Response:', response.data);
    } catch (error) {
        console.error('Get Publications Failed:', error.response ? error.response.data : error.message);
    }
}

async function getPublicationById(id) {
    try {
        const response = await axios.get(`${BASE_URL}/publications/${id}`);
        console.log('Get Publication By ID Response:', response.data);
    } catch (error) {
        console.error('Get Publication By ID Failed:', error.response ? error.response.data : error.message);
    }
}

async function run() {
    await login();
    const pubId = await createPublication();
    if (pubId) {
        await getPublications();
        await getPublicationById(pubId);
    }
}

run();
