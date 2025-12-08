const bcrypt = require('bcryptjs');
const editorApplicationRepository = require('../repositories/EditorApplicationRepository');

class EditorApplicationService {
    async submitApplication(data) {
        const { email, password, confirmPassword } = data;

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const existingApplication = await editorApplicationRepository.findByEmail(email);
        if (existingApplication) {
            throw new Error('Application with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newApplicationData = {
            ...data,
            password: hashedPassword
        };

        // Remove confirmation fields
        delete newApplicationData.confirmPassword;
        delete newApplicationData.confirmEmail;
        delete newApplicationData.captchaInput;

        return await editorApplicationRepository.create(newApplicationData);
    }
}

module.exports = new EditorApplicationService();
