const { Conference } = require('../models');

class ConferenceRepository {
    async create(data) {
        try {
            return await Conference.create(data);
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            return await Conference.findAll();
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            return await Conference.findByPk(id);
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const conference = await Conference.findByPk(id);
            if (!conference) return null;
            return await conference.update(data);
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const conference = await Conference.findByPk(id);
            if (!conference) return null;
            return await conference.destroy();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ConferenceRepository();
