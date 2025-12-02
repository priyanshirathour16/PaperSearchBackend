const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminRepository = require('../repositories/AdminRepository');

class AuthService {
    async login(email, password) {
        console.log(email, password);
        const admin = await adminRepository.findByEmail(email);
        if (!admin) {
            console.log('Admin not found for email:', email);
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log('Password mismatch for email:', email);
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        return token;
    }
}

module.exports = new AuthService();
