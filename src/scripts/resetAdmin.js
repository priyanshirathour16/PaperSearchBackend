const bcrypt = require('bcryptjs');
const { sequelize, Admin } = require('../models');

const resetAdmin = async () => {
    try {
        await sequelize.sync();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin@123', salt);

        const [admin, created] = await Admin.findOrCreate({
            where: { email: 'admin@gmail.com' },
            defaults: {
                password: hashedPassword,
                role: 'admin'
            }
        });

        if (!created) {
            admin.password = hashedPassword;
            admin.role = 'admin';
            await admin.save();
            console.log('Admin password updated');
        } else {
            console.log('Admin created');
        }

    } catch (error) {
        console.error('Error resetting admin:', error);
    } finally {
        await sequelize.close();
    }
};

resetAdmin();
