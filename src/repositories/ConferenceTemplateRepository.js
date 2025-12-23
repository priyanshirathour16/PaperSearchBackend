const { ConferenceTemplate, Conference } = require('../models');

class ConferenceTemplateRepository {
    async create(data) {
        try {
            return await ConferenceTemplate.create(data);
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            return await ConferenceTemplate.findAll({
                include: [{ model: Conference, as: 'conference' }],
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            throw error;
        }
    }

    async getByConferenceId(conferenceId) {
        try {
            return await ConferenceTemplate.findOne({
                where: { conference_id: conferenceId },
                include: [{ model: Conference, as: 'conference' }]
            });
        } catch (error) {
            throw error;
        }
    }

    async update(conferenceId, data) {
        try {
            const template = await ConferenceTemplate.findOne({ where: { conference_id: conferenceId } });
            if (!template) {
                return null;
            }
            return await template.update(data);
        } catch (error) {
            throw error;
        }
    }

    async upsert(conferenceId, data) {
        try {
            const template = await ConferenceTemplate.findOne({ where: { conference_id: conferenceId } });
            if (template) {
                return await template.update(data);
            } else {
                return await ConferenceTemplate.create({ ...data, conference_id: conferenceId });
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(conferenceId) {
        try {
            const template = await ConferenceTemplate.findOne({ where: { conference_id: conferenceId } });
            if (!template) return null;
            return await template.destroy();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ConferenceTemplateRepository();
