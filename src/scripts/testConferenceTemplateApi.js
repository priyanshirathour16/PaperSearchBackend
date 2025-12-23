const conferenceRepository = require('../repositories/ConferenceRepository');
const conferenceTemplateRepository = require('../repositories/ConferenceTemplateRepository');
const sequelize = require('../config/database');

async function testConferenceTemplateFields() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        // Disable logging for sync to keep output clean, force to update schema
        await sequelize.sync({ force: true, logging: false });

        console.log('\n--- 1. Create Base Conference ---');
        const conferenceData = { name: 'Full Field Conference 2025' };
        const conference = await conferenceRepository.create(conferenceData);
        console.log('Created Conference:', conference.id);

        console.log('\n--- 2. Create Template with ALL Fields ---');
        const fullTemplateData = {
            description: 'Comprehensive Description',
            organizing_committee: [{ name: 'Committee Member 1' }],
            important_dates: { start: '2025-01-01' },
            key_benefits: ['Benefit 1', 'Benefit 2'],
            who_should_join: ['Target Audience A'],
            organizer_image: 'http://img.com/org.png',
            partner_image: 'http://img.com/partner.png',
            conference_objectives: 'Objective Text',
            program_schedule: [{ time: '10am' }],
            themes: ['Theme A', 'Theme B'],
            keynote_speakers: [{ name: 'Speaker A' }],
            venue: 'Venue Name',
            venue_image: 'http://img.com/venue.png',
            past_conferences: [{ year: 2024 }],
            organisers: [{ name: 'Organizer Name' }],
            steering_committee: [{ name: 'Steering Member' }],
            review_board: [{ name: 'Reviewer A' }],
            call_for_papers: 'Call for Papers Text',
            guidelines: 'Guidelines Text'
        };

        const template = await conferenceTemplateRepository.upsert(conference.id, fullTemplateData);
        console.log('Template Created.');

        console.log('\n--- 3. Verify ALL Fields ---');
        const fetched = await conferenceTemplateRepository.getByConferenceId(conference.id);

        const fieldsToCheck = [
            'description', 'organizing_committee', 'important_dates', 'key_benefits',
            'who_should_join', 'organizer_image', 'partner_image', 'conference_objectives',
            'program_schedule', 'themes', 'keynote_speakers', 'venue', 'venue_image',
            'past_conferences', 'organisers', 'steering_committee', 'review_board',
            'call_for_papers', 'guidelines'
        ];

        let allMatch = true;
        fieldsToCheck.forEach(field => {
            if (JSON.stringify(fetched[field]) !== JSON.stringify(fullTemplateData[field])) {
                console.error(`Mismatch in field: ${field}`);
                console.log(`Expected:`, fullTemplateData[field]);
                console.log(`Got:`, fetched[field]);
                allMatch = false;
            }
        });

        if (allMatch) {
            console.log('SUCCESS: All fields match!');
            require('fs').writeFileSync('test_result.txt', 'SUCCESS: All fields match!');
        } else {
            console.log('FAILURE: Some fields do not match.');
            require('fs').writeFileSync('test_result.txt', 'FAILURE: Some fields do not match.');
        }

        console.log('\n--- 4. Cleanup ---');
        await conferenceRepository.delete(conference.id);
        console.log('Cleanup Done.');

    } catch (error) {
        console.error('Test Failed:', error);
        require('fs').writeFileSync('test_result.txt', 'Test Failed: ' + error.message);
    } finally {
        await sequelize.close();
    }
}

testConferenceTemplateFields();
