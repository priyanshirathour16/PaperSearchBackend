const conferenceTemplateRepository = require('../repositories/ConferenceTemplateRepository');

// Helper to process request data (Files + JSON parsing)
const prepareTemplateData = (req) => {
    const data = { ...req.body };

    // Handle Single Image Uploads
    if (req.files) {
        if (req.files['organizer_image']) {
            data.organizer_image = req.files['organizer_image'][0].filename;
        }
        if (req.files['organizer_logo']) {
            data.organizer_logo = req.files['organizer_logo'][0].filename;
        }
        if (req.files['partner_image']) {
            data.partner_image = req.files['partner_image'][0].filename;
        }
        if (req.files['venue_image']) {
            data.venue_image = req.files['venue_image'][0].filename;
        }
    }

    // Parse JSON fields
    // NOTE: 'organizing_committee', 'who_should_join', 'themes', 'organisers' are now TEXT (Rich Text), so no parsing needed.
    const jsonFields = [
        'important_dates', 'key_benefits', 'program_schedule',
        'keynote_speakers', 'past_conferences', 'steering_committee',
        'review_board', 'venue'
    ];

    jsonFields.forEach(field => {
        if (data[field] && typeof data[field] === 'string') {
            try {
                data[field] = JSON.parse(data[field]);
            } catch (e) {
                console.error(`Failed to parse JSON for field ${field}:`, e);
            }
        }
    });

    // Handle Keynote Speaker Images
    // Logic: The client sends 'keynote_speakers' JSON. We expect the JSON objects to optionally have an 'image_index' property
    // which corresponds to the index in the uploaded 'keynote_speaker_images' file array.
    // OR, more simply, if files exist, we can try to map them if the client provides a mapping mechanism.
    // robust approach: We map uploaded files to "image" property of speakers if 'image_index' is present.
    if (req.files && req.files['keynote_speaker_images'] && Array.isArray(data.keynote_speakers)) {
        const speakerImages = req.files['keynote_speaker_images'];

        data.keynote_speakers = data.keynote_speakers.map(speaker => {
            if (speaker.image_index !== undefined && speakerImages[speaker.image_index]) {
                return {
                    ...speaker,
                    image: speakerImages[speaker.image_index].filename,
                    image_index: undefined // Remove the helper index
                };
            }
            return speaker;
        });
    }

    return data;
};

// Upsert Template (Create or Update)
exports.upsertTemplate = async (req, res) => {
    try {
        const { conference_id } = req.body;
        if (!conference_id) {
            return res.status(400).json({ error: { message: 'conference_id is required' } });
        }

        const data = prepareTemplateData(req);
        const template = await conferenceTemplateRepository.upsert(conference_id, data);
        res.status(200).json({ success: template });
    } catch (error) {
        res.status(500).json({ error: { message: 'Error saving conference template', details: error.message } });
    }
};

// Update Template (Explicit PUT)
exports.updateTemplate = async (req, res) => {
    try {
        const { conferenceId } = req.params;

        // Ensure conference exists or checks are done by repo usually, but repo.update returns null if not found.
        const data = prepareTemplateData(req);

        const updatedTemplate = await conferenceTemplateRepository.update(conferenceId, data);

        if (!updatedTemplate) {
            return res.status(404).json({ error: { message: 'Template not found for this conference' } });
        }

        res.status(200).json({ success: updatedTemplate });
    } catch (error) {
        res.status(500).json({ error: { message: 'Error updating conference template', details: error.message } });
    }
};

// Get All Templates
exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await conferenceTemplateRepository.getAll();
        res.status(200).json({ success: templates });
    } catch (error) {
        res.status(500).json({ error: { message: 'Error fetching conference templates', details: error.message } });
    }
};


// Get Template by Conference ID
exports.getTemplateByConferenceId = async (req, res) => {
    try {
        const { conferenceId } = req.params;
        const template = await conferenceTemplateRepository.getByConferenceId(conferenceId);

        if (!template) {
            return res.status(404).json({ error: { message: 'Template not found for this conference' } });
        }

        res.status(200).json({ success: template });
    } catch (error) {
        res.status(500).json({ error: { message: 'Error fetching conference template', details: error.message } });
    }
};

// Delete Template
exports.deleteTemplate = async (req, res) => {
    try {
        const { conferenceId } = req.params;
        const result = await conferenceTemplateRepository.delete(conferenceId);
        if (!result) {
            return res.status(404).json({ error: { message: 'Template not found for this conference' } });
        }
        res.status(200).json({ success: { message: "Template deleted successfully" } });
    } catch (error) {
        res.status(500).json({ error: { message: 'Error deleting conference template', details: error.message } });
    }
}
