const bcrypt = require('bcryptjs');
const { sequelize, Admin } = require('../models');

const seedAdmin = async () => {
    try {
        await sequelize.sync();

        const existingAdmin = await Admin.findOne({ where: { email: 'admin@gmail.com' } });
        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin@123', salt);

        await Admin.create({
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'admin',
        });

        await Admin.create({
            email: 'superadmin@gmail.com',
            password: hashedPassword,
            role: 'author',
        });

        console.log('Admin user created');
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await sequelize.close();
    }
};

seedAdmin();
