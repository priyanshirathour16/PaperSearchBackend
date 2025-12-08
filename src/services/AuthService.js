const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminRepository = require('../repositories/AdminRepository');
const authorRepository = require('../repositories/AuthorRepository');

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
            { id: admin.id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        return { token, role: admin.role };
    }

    async registerAuthor(authorData) {
        const { email, password, confirmPassword } = authorData;

        // Validation happens in controller/middleware, but double check here
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const existingAuthor = await authorRepository.findByEmail(email);
        if (existingAuthor) {
            throw new Error('Author already exists with this email');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Remove confirm fields and other non-model fields if necessary, 
        // though Sequelize usually ignores extra fields if not defined in model, 
        // it's cleaner to prepare the object.
        const newAuthorPayload = {
            ...authorData,
            password: hashedPassword
        };
        // Remove confirmPassword/confirmEmail to be safe/clean
        delete newAuthorPayload.confirmPassword;
        delete newAuthorPayload.confirmEmail;
        delete newAuthorPayload.captchaInput; // Not storing captcha

        const newAuthor = await authorRepository.create(newAuthorPayload);

        // Return without password
        const { password: _, ...authorResponse } = newAuthor.toJSON();
        return authorResponse;
    }
}

module.exports = new AuthService();
