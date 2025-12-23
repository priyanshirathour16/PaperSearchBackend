const conferenceTemplateController = require('../controllers/conferenceTemplateController');
const conferenceRepository = require('../repositories/ConferenceRepository');
const conferenceTemplateRepository = require('../repositories/ConferenceTemplateRepository');
const sequelize = require('../config/database');

// Wait function to ensure timestamp difference
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testEnhancements() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false, logging: false });
        console.log('Database connected.');

        // 1. Test Sorting (Create 2 templates with delay)
        const conf1 = await conferenceRepository.create({ name: 'Sorted Conf 1' });
        await conferenceTemplateRepository.upsert(conf1.id, { description: 'Old' });

        await wait(1000); // 1 sec delay to ensure createdAt difference

        const conf2 = await conferenceRepository.create({ name: 'Sorted Conf 2' });
        await conferenceTemplateRepository.upsert(conf2.id, { description: 'New' });

        const resSort = {
            status: function (code) { this.statusCode = code; return this; },
            json: function (data) { this.data = data; return this; }
        };
        await conferenceTemplateController.getAllTemplates({}, resSort);

        if (resSort.statusCode === 200 && resSort.data.success.length >= 2) {
            const first = resSort.data.success[0];
            const second = resSort.data.success[1];
            console.log(`First returned: ID ${first.conference_id} (${first.description})`);
            console.log(`Second returned: ID ${second.conference_id} (${second.description})`);

            // Check if New comes before Old
            if (new Date(first.createdAt) > new Date(second.createdAt)) {
                console.log('SUCCESS: Sorting is DESC (Newest First).');
                require('fs').writeFileSync('test_new_result.txt', 'SUCCESS: Sorting verified.');
            } else {
                console.log('FAILURE: Sorting is NOT DESC.');
                require('fs').writeFileSync('test_new_result.txt', 'FAILURE: Sorting mismatch.');
            }
        }

        // 2. Test PUT /template/:id
        const reqPut = {
            params: { conferenceId: conf1.id },
            body: { description: 'Updated via PUT' }
        };
        const resPut = {
            status: function (code) { this.statusCode = code; return this; },
            json: function (data) { this.data = data; return this; }
        };

        await conferenceTemplateController.updateTemplate(reqPut, resPut);
        if (resPut.statusCode === 200 && resPut.data.success.description === 'Updated via PUT') {
            console.log('SUCCESS: PUT /template/:id updated successfully.');
            require('fs').appendFileSync('test_new_result.txt', '\nSUCCESS: PUT verified.');
        } else {
            console.log('FAILURE: PUT /template/:id failed.');
            require('fs').appendFileSync('test_new_result.txt', '\nFAILURE: PUT failed.');
        }


        // Cleanup
        await conferenceRepository.delete(conf1.id);
        await conferenceRepository.delete(conf2.id);

    } catch (error) {
        console.error('Test Failed:', error);
        require('fs').writeFileSync('test_new_result.txt', 'FAILURE: ' + error.message);
    } finally {
        await sequelize.close();
    }
}

testEnhancements();
