const { Admin } = require('../models');

class AdminRepository {
    async findByEmail(email) {
        return await Admin.findOne({ where: { email } });
    }

    async create(adminData) {
        return await Admin.create(adminData);
    }
}

module.exports = new AdminRepository();
