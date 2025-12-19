const { Publication, Journal, JournalIssue } = require('../models');
const { Op } = require('sequelize');

exports.createPublication = async (req, res) => {
    try {
        const {
            journal_id,
            issue_id,
            manuscript_id,
            title,
            author_name,
            doi,
            pages,
            author_affiliations,
            abstract_description,
            abstract_keywords,
            abstract_references
        } = req.body;

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'PDF file is required'
            });
        }

        const pdf_path = req.file.filename;

        const publication = await Publication.create({
            journal_id,
            issue_id,
            manuscript_id,
            title,
            author_name,
            doi,
            pages,
            author_affiliations,
            abstract_description,
            abstract_keywords,
            abstract_references,
            pdf_path
        });

        res.status(201).json({
            success: true,
            message: 'Publication created successfully',
            data: publication
        });
    } catch (error) {
        console.error('Error creating publication:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getAllPublications = async (req, res) => {
    try {
        const { journal_id, issue_id, search } = req.query;
        const where = {};

        if (journal_id) where.journal_id = journal_id;
        if (issue_id) where.issue_id = issue_id;
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { author_name: { [Op.like]: `%${search}%` } },
                { manuscript_id: { [Op.like]: `%${search}%` } }
            ];
        }

        const publications = await Publication.findAll({
            where,
            include: [
                { model: Journal, as: 'journal' },
                { model: JournalIssue, as: 'issue' }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: publications.length,
            message: 'Publications fetched successfully',
            data: publications
        });
    } catch (error) {
        console.error('Error fetching publications:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getPublicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const publication = await Publication.findByPk(id, {
            include: [
                { model: Journal, as: 'journal' },
                { model: JournalIssue, as: 'issue' }
            ]
        });

        if (!publication) {
            return res.status(404).json({ success: false, message: 'Publication not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Publication details fetched successfully',
            data: publication
        });
    } catch (error) {
        console.error('Error fetching publication:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const publication = await Publication.findByPk(id);

        if (!publication) {
            return res.status(404).json({ success: false, message: 'Publication not found' });
        }

        if (req.file) {
            updateData.pdf_path = req.file.filename;
        }

        await publication.update(updateData);

        const updatedPublication = await Publication.findByPk(id, {
            include: [
                { model: Journal, as: 'journal' },
                { model: JournalIssue, as: 'issue' }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Publication updated successfully',
            data: updatedPublication
        });
    } catch (error) {
        console.error('Error updating publication:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deletePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findByPk(id);

        if (!publication) {
            return res.status(404).json({ success: false, message: 'Publication not found' });
        }

        await publication.destroy();

        res.status(200).json({
            success: true,
            message: 'Publication deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting publication:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
