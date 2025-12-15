const manuscriptService = require('../services/ManuscriptService');

exports.submitManuscript = async (req, res, next) => {
    try {
        // Files are processed by middleware
        const files = req.files || {};

        // Body contains fields
        const data = req.body;

        const result = await manuscriptService.submitManuscript(data, files);

        res.status(201).json({
            message: 'Manuscript submitted successfully',
            data: result
        });
    } catch (error) {
        if (error.message === 'Journal not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Author already exists. Please login to submit.') {
            return res.status(409).json({ message: error.message });
        }
        if (error.message === 'Manuscript file is required' || error.message === 'Invalid authors JSON format') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

exports.getAllManuscripts = async (req, res, next) => {
    try {
        const manuscripts = await manuscriptService.getAllManuscripts();
        res.status(200).json({
            message: 'Manuscripts fetched successfully',
            data: manuscripts
        });
    } catch (error) {
        next(error);
    }
};

exports.getManuscriptById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const manuscript = await manuscriptService.getManuscriptByPublicId(id);

        if (!manuscript) {
            return res.status(404).json({ message: 'Manuscript not found' });
        }

        res.status(200).json({
            message: 'Manuscript details fetched successfully',
            data: manuscript
        });
    } catch (error) {
        next(error);
    }
};
