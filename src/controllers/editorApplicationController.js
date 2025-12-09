const { validationResult } = require('express-validator');
const editorApplicationService = require('../services/EditorApplicationService');

exports.submitApplication = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const applicationData = req.body;

        // Handle file upload
        if (req.file) {
            applicationData.cvFile = req.file.path;
        }

        const result = await editorApplicationService.submitApplication(applicationData);

        // Don't simplify return too much, returning the created object is fine but omit password
        const { password, ...resultWithoutPassword } = result.toJSON();

        res.status(201).json({
            message: 'Editor application submitted successfully',
            application: resultWithoutPassword
        });
    } catch (error) {
        if (error.message === 'Application with this email already exists') {
            return res.status(409).json({ message: error.message });
        }
        if (error.message === 'Passwords do not match') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

exports.getAllApplications = async (req, res, next) => {
    try {
        const applications = await editorApplicationService.getAllApplications();
        const formattedApplications = applications.map(app => {
            const appJson = app.toJSON();
            return {
                ...appJson,
                journal: app.journalData ? app.journalData.title : 'N/A'
            };
        });
        res.json(formattedApplications);
    } catch (error) {
        next(error);
    }
};

exports.getApplicationById = async (req, res, next) => {
    try {
        const application = await editorApplicationService.getApplicationById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        const appJson = application.toJSON();
        const formattedApplication = {
            ...appJson,
            journal: application.journalData ? application.journalData.title : 'N/A'
        };
        res.json(formattedApplication);
    } catch (error) {
        if (error.message === 'Application not found') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

exports.deleteApplication = async (req, res, next) => {
    try {
        await editorApplicationService.deleteApplication(req.params.id);
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        if (error.message === 'Application not found') {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};
