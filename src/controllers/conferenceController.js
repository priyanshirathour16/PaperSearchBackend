const Conference = require('../models/Conference');

// Add Conference
exports.addConference = async (req, res) => {
    try {
        const { name, organized_by, start_date } = req.body;
        const newConference = await Conference.create({
            name,
            organized_by,
            start_date
        });
        res.status(201).json(newConference);
    } catch (error) {
        res.status(500).json({ message: 'Error adding conference', error: error.message });
    }
};

// Edit Conference
exports.editConference = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, organized_by, start_date } = req.body;
        const conference = await Conference.findByPk(id);

        if (!conference) {
            return res.status(404).json({ message: 'Conference not found' });
        }

        conference.name = name || conference.name;
        conference.organized_by = organized_by || conference.organized_by;
        conference.start_date = start_date || conference.start_date;

        await conference.save();
        res.status(200).json(conference);
    } catch (error) {
        res.status(500).json({ message: 'Error updating conference', error: error.message });
    }
};

// Delete Conference
exports.deleteConference = async (req, res) => {
    try {
        const { id } = req.params;
        const conference = await Conference.findByPk(id);

        if (!conference) {
            return res.status(404).json({ message: 'Conference not found' });
        }

        await conference.destroy();
        res.status(200).json({ message: 'Conference deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting conference', error: error.message });
    }
};

// Get All Conferences
exports.getAllConferences = async (req, res) => {
    try {
        const conferences = await Conference.findAll();
        res.status(200).json(conferences);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conferences', error: error.message });
    }
};

// Get Conference By ID
exports.getConferenceById = async (req, res) => {
    try {
        const { id } = req.params;
        const conference = await Conference.findByPk(id);

        if (!conference) {
            return res.status(404).json({ message: 'Conference not found' });
        }

        res.status(200).json(conference);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conference', error: error.message });
    }
};
