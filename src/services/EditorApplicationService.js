const editorApplicationRepository = require('../repositories/EditorApplicationRepository');
const authorRepository = require('../repositories/AuthorRepository');
const bcrypt = require('bcryptjs');

class EditorApplicationService {
    async submitApplication(data) {
        if (data.journal) {
            data.journal_id = data.journal;
            delete data.journal;
        }

        // Check if email already exists in EditorApplication
        const existingApplication = await editorApplicationRepository.findByEmail(data.email);
        if (existingApplication) {
            throw new Error('Application with this email already exists');
        }

        // Check if email already exists in Author
        const existingAuthor = await authorRepository.findByEmail(data.email);
        if (existingAuthor) {
            throw new Error('Email is already registered as an author');
        }

        if (data.password !== data.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const applicationData = {
            ...data,
            password: hashedPassword
        };

        return await editorApplicationRepository.create(applicationData);
    }

    async getAllApplications() {
        return await editorApplicationRepository.findAll();
    }

    async getApplicationById(id) {
        const application = await editorApplicationRepository.findById(id);
        if (!application) {
            throw new Error('Application not found');
        }
        return application;
    }

    async deleteApplication(id) {
        const deleted = await editorApplicationRepository.delete(id);
        if (!deleted) {
            throw new Error('Application not found');
        }
        return { message: 'Application deleted successfully' };
    }
}

module.exports = new EditorApplicationService();
