const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testData = {
    name: 'Dr. John Smith',
    email: 'john.smith.test@example.com',
    phone: '+1234567890',
    journalId: 1, // Make sure this journal exists in your database
    manuscriptType: 'Research paper',
    paperTitle: 'Advanced Machine Learning Techniques for Natural Language Processing',
    abstract: 'This research paper explores cutting-edge machine learning techniques applied to natural language processing tasks. We present a novel approach that combines transformer architectures with reinforcement learning to achieve state-of-the-art results on multiple benchmark datasets. Our methodology demonstrates significant improvements in accuracy and efficiency compared to existing methods. The paper includes comprehensive experimental results and detailed analysis of the proposed approach.',
    wordCount: 5000,
    keywords: JSON.stringify(['machine learning', 'NLP', 'transformers', 'deep learning']),
    authors: JSON.stringify([
        {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@university.edu',
            confirmEmail: 'jane.doe@university.edu',
            phone: '+1987654321',
            country: 'USA',
            institution: 'Massachusetts Institute of Technology',
            designation: 'Associate Professor',
            department: 'Computer Science',
            state: 'Massachusetts',
            city: 'Cambridge',
            address: '77 Massachusetts Avenue',
            isCorrespondingAuthor: true
        },
        {
            firstName: 'Robert',
            lastName: 'Johnson',
            email: 'robert.j@stanford.edu',
            confirmEmail: 'robert.j@stanford.edu',
            phone: '+1555123456',
            country: 'USA',
            institution: 'Stanford University',
            designation: 'Research Scientist',
            department: 'Artificial Intelligence Lab',
            state: 'California',
            city: 'Stanford',
            address: '450 Serra Mall',
            isCorrespondingAuthor: false
        }
    ]),
    reviewerFirstName: 'Emily',
    reviewerLastName: 'Chen',
    reviewerEmail: 'emily.chen@university.edu',
    reviewerPhone: '+1444555666',
    reviewerCountry: 'USA',
    reviewerInstitution: 'Harvard University',
    reviewerDesignation: 'Professor',
    reviewerSpecialisation: 'Machine Learning and AI',
    reviewerDepartment: 'Computer Science',
    reviewerState: 'Massachusetts',
    reviewerCity: 'Cambridge',
    reviewerAddress: '1 Oxford Street',
    checklist: JSON.stringify({
        isSoleSubmission: true,
        isNotPublished: true,
        isOriginalWork: true,
        hasDeclaredConflicts: true,
        hasAcknowledgedSupport: true,
        hasAcknowledgedFunding: true,
        followsGuidelines: true
    })
};

async function createDummyPDF(filename) {
    const content = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Test Manuscript) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000317 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
410
%%EOF`;

    const filepath = path.join(__dirname, filename);
    fs.writeFileSync(filepath, content);
    return filepath;
}

async function testManuscriptSubmission() {
    console.log('='.repeat(60));
    console.log('TESTING MANUSCRIPT SUBMISSION FLOW');
    console.log('='.repeat(60));

    let manuscriptFilePath, coverLetterPath;

    try {
        // Create dummy PDF files for testing
        console.log('\n1. Creating test PDF files...');
        manuscriptFilePath = await createDummyPDF('test_manuscript.pdf');
        coverLetterPath = await createDummyPDF('test_cover_letter.pdf');
        console.log('✓ Test files created');

        // Step 1: Send OTP
        console.log('\n2. Sending OTP to email:', testData.email);
        const otpResponse = await axios.post(`${BASE_URL}/otp/send`, {
            email: testData.email,
            name: testData.name,
            phone: testData.phone
        });
        console.log('✓ OTP sent successfully');
        console.log('Response:', JSON.stringify(otpResponse.data, null, 2));

        // Prompt for OTP
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('\nEnter the OTP code received: ', async (otpCode) => {
            try {
                // Step 2: Verify OTP
                console.log('\n3. Verifying OTP...');
                const verifyResponse = await axios.post(`${BASE_URL}/otp/verify`, {
                    email: testData.email,
                    otp: otpCode
                });
                console.log('✓ OTP verified successfully');

                // Step 3: Submit manuscript
                console.log('\n4. Submitting manuscript...');
                const formData = new FormData();

                // Add all text fields
                Object.keys(testData).forEach(key => {
                    formData.append(key, testData[key]);
                });

                // Add files
                formData.append('manuscriptFile', fs.createReadStream(manuscriptFilePath));
                formData.append('coverLetter', fs.createReadStream(coverLetterPath));

                const submitResponse = await axios.post(
                    `${BASE_URL}/manuscripts/submit`,
                    formData,
                    {
                        headers: formData.getHeaders(),
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity
                    }
                );

                console.log('✓ Manuscript submitted successfully!');
                console.log('\nSubmission Response:');
                console.log(JSON.stringify(submitResponse.data, null, 2));

                const manuscriptId = submitResponse.data.manuscriptId;

                // Step 4: Retrieve manuscript details
                console.log('\n5. Retrieving manuscript details...');
                const detailsResponse = await axios.get(
                    `${BASE_URL}/manuscripts/${manuscriptId}`
                );
                console.log('✓ Manuscript details retrieved');
                console.log('\nManuscript Details:');
                console.log(JSON.stringify(detailsResponse.data, null, 2));

                console.log('\n' + '='.repeat(60));
                console.log('MANUSCRIPT SUBMISSION TEST COMPLETED SUCCESSFULLY');
                console.log('='.repeat(60));
                console.log('\nKey Points:');
                console.log('- Manuscript ID:', manuscriptId);
                console.log('- New author account created:', submitResponse.data.isNewAuthor);
                console.log('- Check email for submission acknowledgment');
                if (submitResponse.data.isNewAuthor) {
                    console.log('- Check email for account credentials');
                }

            } catch (error) {
                console.error('\n✗ Manuscript submission failed');
                console.error('Error:', error.response?.data || error.message);
                if (error.response?.data) {
                    console.error('Full error:', JSON.stringify(error.response.data, null, 2));
                }
            } finally {
                // Cleanup test files
                console.log('\n6. Cleaning up test files...');
                if (fs.existsSync(manuscriptFilePath)) fs.unlinkSync(manuscriptFilePath);
                if (fs.existsSync(coverLetterPath)) fs.unlinkSync(coverLetterPath);
                console.log('✓ Test files removed');

                readline.close();
            }
        });

    } catch (error) {
        console.error('\n✗ Test failed');
        console.error('Error:', error.response?.data || error.message);
        console.error('\nMake sure:');
        console.error('1. Server is running on port 5000');
        console.error('2. Database is connected');
        console.error('3. Journal with ID 1 exists in the database');

        // Cleanup on error
        if (manuscriptFilePath && fs.existsSync(manuscriptFilePath)) {
            fs.unlinkSync(manuscriptFilePath);
        }
        if (coverLetterPath && fs.existsSync(coverLetterPath)) {
            fs.unlinkSync(coverLetterPath);
        }
    }
}

// Run the test
testManuscriptSubmission();
