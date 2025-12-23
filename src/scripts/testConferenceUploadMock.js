const conferenceTemplateController = require('../controllers/conferenceTemplateController');
const conferenceRepository = require('../repositories/ConferenceRepository');
const conferenceTemplateRepository = require('../repositories/ConferenceTemplateRepository');
const sequelize = require('../config/database');

async function testUploadLogic() {
    try {
        await sequelize.authenticate();
        // Disable logging for sync to keep output clean, force to update schema
        await sequelize.sync({ force: false, logging: false });

        console.log('Database connected.');

        // 1. Create Base Conference
        const conference = await conferenceRepository.create({ name: 'Upload Test Conf' });
        console.log('Created Conference:', conference.id);

        // 2. Mock Request and Response
        const req = {
            body: {
                conference_id: conference.id,
                description: 'Test Upload Description',
                // Stringified JSONs as they would come from multipart
                organizing_committee: JSON.stringify([{ name: 'Upload Committee' }]),
                theme: 'Ignore this', // Random field
                themes: JSON.stringify(['Theme Upload'])
            },
            files: {
                organizer_image: [{ filename: 'mock_org.jpg' }],
                partner_image: [{ filename: 'mock_partner.png' }]
                // venue_image missing to test partial upload
            }
        };

        const res = {
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.data = data;
                return this;
            }
        };

        // 3. Call Controller
        await conferenceTemplateController.upsertTemplate(req, res);

        // 4. Verify Response
        if (res.statusCode === 200) {
            console.log('Controller Success:', res.data.success.id);

            // Check if filenames were saved
            const savedTemplate = await conferenceTemplateRepository.getByConferenceId(conference.id);
            console.log('Saved Organizer Img:', savedTemplate.organizer_image);
            console.log('Saved Partner Img:', savedTemplate.partner_image);
            console.log('Saved Venue Img (Should be null):', savedTemplate.venue_image);

            // Check if JSON was parsed
            console.log('Parsed Committee:', savedTemplate.organizing_committee);

            if (savedTemplate.organizer_image === 'mock_org.jpg' &&
                savedTemplate.organizing_committee[0].name === 'Upload Committee') {
                console.log('SUCCESS: Logic verified.');
                require('fs').writeFileSync('test_upload_result.txt', 'SUCCESS');
            } else {
                console.log('FAILURE: Data mismatch.');
                require('fs').writeFileSync('test_upload_result.txt', 'FAILURE: Data mismatch');
            }

        } else {
            console.log('Controller Failed:', res.statusCode, res.data);
            require('fs').writeFileSync('test_upload_result.txt', 'FAILURE: Controller returned ' + res.statusCode);
        }

        // Cleanup
        await conferenceRepository.delete(conference.id);

    } catch (error) {
        console.error('Test Failed:', error);
        require('fs').writeFileSync('test_upload_result.txt', 'FAILURE: ' + error.message);
    } finally {
        await sequelize.close();
    }
}

testUploadLogic();
