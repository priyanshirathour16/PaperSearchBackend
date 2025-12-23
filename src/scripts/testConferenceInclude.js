const conferenceTemplateController = require('../controllers/conferenceTemplateController');
const conferenceRepository = require('../repositories/ConferenceRepository');
const conferenceTemplateRepository = require('../repositories/ConferenceTemplateRepository');
const sequelize = require('../config/database');

async function testInclude() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false, logging: false });
        console.log('Database connected.');

        // 1. Create Conference
        const conf = await conferenceRepository.create({ name: 'Include Test Conf' });
        console.log('Created Conference:', conf.id);

        // 2. Create Template
        await conferenceTemplateRepository.upsert(conf.id, { description: 'Include Test' });

        // 3. Test GET for Include
        const req = { params: { conferenceId: conf.id } };
        const res = {
            status: function (code) { this.statusCode = code; return this; },
            json: function (data) { this.data = data; return this; }
        };

        await conferenceTemplateController.getTemplateByConferenceId(req, res);

        if (res.statusCode === 200) {
            const result = res.data.success;
            if (result.conference && result.conference.name === 'Include Test Conf') {
                console.log('SUCCESS: Conference data included correctly.');
                require('fs').writeFileSync('test_include_result.txt', 'SUCCESS: Included.');
            } else {
                console.log('FAILURE: Conference data MISSING or unmatched.');
                console.log('Result:', JSON.stringify(result, null, 2));
                require('fs').writeFileSync('test_include_result.txt', 'FAILURE: Missing include.');
            }
        } else {
            console.log('FAILURE: GET failed.');
            require('fs').writeFileSync('test_include_result.txt', 'FAILURE: GET failed.');
        }

        // Cleanup
        await conferenceRepository.delete(conf.id);

    } catch (error) {
        console.error('Test Failed:', error);
        require('fs').writeFileSync('test_include_result.txt', 'FAILURE: ' + error.message);
    } finally {
        await sequelize.close();
    }
}

testInclude();
