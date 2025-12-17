const { Admin } = require('../models');

class AdminRepository {
    async findByEmail(email) {
        return await Admin.findOne({ where: { email } });
    }

    async create(adminData) {
        return await Admin.create(adminData);
    }

    async findById(id) {
        return await Admin.findByPk(id);
    }
}

module.exports = new AdminRepository();
