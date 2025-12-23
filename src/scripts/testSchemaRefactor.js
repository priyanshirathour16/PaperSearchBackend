const conferenceTemplateController = require('../controllers/conferenceTemplateController');
const conferenceRepository = require('../repositories/ConferenceRepository');
const conferenceTemplateRepository = require('../repositories/ConferenceTemplateRepository');
const sequelize = require('../config/database');

async function testRefactor() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Use force: true to ensure clean table creation for new schema (JSON/TEXT changes)
        await sequelize.sync({ force: true, logging: false });

        const conf = await conferenceRepository.create({ name: 'Refactor Conf' });

        // Mock Request
        const req = {
            body: {
                conference_id: conf.id,
                description: '<p>Desc</p>',
                organizing_committee: '<p>Committee HTML</p>', // TEXT
                who_should_join: '<p>Who HTML</p>', // TEXT
                themes: '<p>Themes HTML</p>', // TEXT
                organisers: '<p>Organisers HTML</p>', // TEXT
                venue: JSON.stringify({ name: "Grand Hall", map_link: "http://map" }), // JSON
                important_dates: JSON.stringify({
                    abstract_submission: { startDate: "2024-01-01", lastDate: "2024-02-01" },
                    full_paper_submission: { startDate: "2024-03-01", lastDate: "2024-04-01" },
                    registration: { startDate: "2024-05-01", lastDate: "2024-06-01" }
                }),
                keynote_speakers: JSON.stringify([
                    { name: "Speaker 1", designation: "CEO", about: "Boss", image_index: 0 },
                    { name: "Speaker 2", designation: "CTO", about: "Tech", image_index: 1 }
                ])
            },
            files: {
                'keynote_speaker_images': [
                    { filename: 'speaker1.jpg', fieldname: 'keynote_speaker_images' },
                    { filename: 'speaker2.jpg', fieldname: 'keynote_speaker_images' }
                ],
                'venue_image': [{ filename: 'venue.jpg' }]
            }
        };

        const res = {
            status: function (code) { this.statusCode = code; return this; },
            json: function (data) { this.data = data; return this; }
        };

        await conferenceTemplateController.upsertTemplate(req, res);

        if (res.statusCode === 200) {
            const result = res.data.success;
            // Verify Logic
            let success = true;
            if (result.organizing_committee !== '<p>Committee HTML</p>') {
                console.log('FAIL: organizing_committee mismatch');
                success = false;
            }
            if (result.venue.name !== 'Grand Hall') {
                console.log('FAIL: venue mismatch');
                success = false;
            }
            if (!Array.isArray(result.keynote_speakers)) {
                console.log('FAIL: keynote_speakers not array');
                success = false;
            } else {
                if (result.keynote_speakers[0].image !== 'speaker1.jpg') {
                    console.log('FAIL: Speaker 1 image not mapped. Got:', result.keynote_speakers[0]);
                    success = false;
                }
                if (result.keynote_speakers[1].image !== 'speaker2.jpg') {
                    console.log('FAIL: Speaker 2 image not mapped.');
                    success = false;
                }
            }

            if (success) {
                console.log('SUCCESS: Schema Refactor Verified.');
                require('fs').writeFileSync('test_refactor_result.txt', 'SUCCESS: Refactor verified.');
            } else {
                require('fs').writeFileSync('test_refactor_result.txt', 'FAILURE: Data mismatch.');
            }

        } else {
            console.log('FAILURE: Upsert Status', res.statusCode);
            console.log(res.data);
            require('fs').writeFileSync('test_refactor_result.txt', 'FAILURE: Upsert error.');
        }

        // Cleanup
        await conferenceRepository.delete(conf.id);

    } catch (error) {
        console.error('Test Failed:', error);
        require('fs').writeFileSync('test_refactor_result.txt', 'FAILURE: ' + error.message);
    } finally {
        await sequelize.close();
    }
}

testRefactor();
