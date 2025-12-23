const conferenceRepository = require('../repositories/ConferenceRepository');

// Add Conference (Base Entity)
exports.addConference = async (req, res) => {
    try {
        const data = req.body; // Expects { name: "Conference Name" }
        const newConference = await conferenceRepository.create(data);
        res.status(201).json({ success: newConference });
    } catch (error) {
        res.status(500).json({ error: { message: 'Error adding conference', details: error.message } });
    }
};

// Edit Conference (Name only)
exports.editConference = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedConference = await conferenceRepository.update(id, data);

        if (!updatedConference) {
            return res.status(404).json({ error: { message: 'Conference not found' } });
        }

        res.status(200).json({ success: updatedConference });
    } catch (error) {
        res.status(500).json({ error: { message: 'Error updating conference', details: error.message } });
    }
};

// Delete Conference
exports.deleteConference = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await conferenceRepository.delete(id);

        if (!deleted) {
            return res.status(404).json({ error: { message: 'Conference not found' } });
        }

        res.status(200).json({ success: { message: 'Conference deleted successfully' } });
    } catch (error) {
        res.status(500).json({ error: { message: 'Error deleting conference', details: error.message } });
    }
};

// Get All Conferences (Commonly for Dropdown)
exports.getAllConferences = async (req, res) => {
    try {
        const conferences = await conferenceRepository.getAll();
        res.status(200).json({ success: conferences });
    } catch (error) {
        res.status(500).json({ error: { message: 'Error fetching conferences', details: error.message } });
    }
};

// Get Conference By ID
exports.getConferenceById = async (req, res) => {
    try {
        const { id } = req.params;
        const conference = await conferenceRepository.getById(id);

        if (!conference) {
            return res.status(404).json({ error: { message: 'Conference not found' } });
        }

        res.status(200).json({ success: conference });
    } catch (error) {
        res.status(500).json({ error: { message: 'Error fetching conference', details: error.message } });
    }
};
