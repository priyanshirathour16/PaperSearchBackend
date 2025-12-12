const { ContactUs } = require('../models');

class ContactUsRepository {
    async create(data) {
        return await ContactUs.create(data);
    }

    async findAll() {
        return await ContactUs.findAll({
            order: [['createdAt', 'DESC']]
        });
    }

    async delete(id) {
        return await ContactUs.destroy({
            where: { id }
        });
    }

    async findById(id) {
        return await ContactUs.findByPk(id);
    }
}

module.exports = new ContactUsRepository();
