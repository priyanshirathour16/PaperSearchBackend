const conferenceTemplateController = require('../controllers/conferenceTemplateController');
const conferenceRepository = require('../repositories/ConferenceRepository');
const conferenceTemplateRepository = require('../repositories/ConferenceTemplateRepository');
const sequelize = require('../config/database');

async function testTemplateList() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false, logging: false });
        console.log('Database connected.');

        // 1. Create Conferences and Templates
        const conf1 = await conferenceRepository.create({ name: 'Conf 1' });
        const conf2 = await conferenceRepository.create({ name: 'Conf 2' });

        await conferenceTemplateRepository.upsert(conf1.id, { description: 'Desc 1' });
        await conferenceTemplateRepository.upsert(conf2.id, { description: 'Desc 2' });

        console.log('Created 2 templates.');

        // 2. Mock Request for GET ALL
        const reqAll = {};
        const resAll = {
            status: function (code) { this.statusCode = code; return this; },
            json: function (data) { this.data = data; return this; }
        };

        await conferenceTemplateController.getAllTemplates(reqAll, resAll);

        if (resAll.statusCode === 200 && Array.isArray(resAll.data.success)) {
            console.log(`GET /template SUCCESS: Retrieved ${resAll.data.success.length} templates.`);
            const foundCount = resAll.data.success.length;
            if (foundCount >= 2) {
                require('fs').writeFileSync('test_start_result.txt', 'SUCCESS: Retrieved multiple templates');
            } else {
                console.log('FAILURE: Count mismatch');
                require('fs').writeFileSync('test_start_result.txt', 'FAILURE: Count mismatch');
            }
        } else {
            console.log('GET /template FAILURE');
            require('fs').writeFileSync('test_start_result.txt', 'FAILURE: GET /template failed');
        }

        // 3. Mock Request for GET By ID
        const reqId = { params: { conferenceId: conf1.id } };
        const resId = {
            status: function (code) { this.statusCode = code; return this; },
            json: function (data) { this.data = data; return this; }
        };

        await conferenceTemplateController.getTemplateByConferenceId(reqId, resId);
        if (resId.statusCode === 200 && resId.data.success.description === 'Desc 1') {
            console.log('GET /template/:id SUCCESS: Retrieved specific template.');
        } else {
            console.log('GET /template/:id FAILURE');
        }

        // Cleanup
        await conferenceRepository.delete(conf1.id);
        await conferenceRepository.delete(conf2.id);

    } catch (error) {
        console.error('Test Failed:', error);
        require('fs').writeFileSync('test_start_result.txt', 'FAILURE: ' + error.message);
    } finally {
        await sequelize.close();
    }
}

testTemplateList();
