const contactUsRepository = require('../repositories/ContactUsRepository');

class ContactUsService {
    async submitContact(data) {
        return await contactUsRepository.create(data);
    }

    async getAllContacts() {
        return await contactUsRepository.findAll();
    }

    async deleteContact(id) {
        const deleted = await contactUsRepository.delete(id);
        if (!deleted) {
            throw new Error('Contact inquiry not found');
        }
        return { message: 'Contact inquiry deleted successfully' };
    }
}

module.exports = new ContactUsService();
