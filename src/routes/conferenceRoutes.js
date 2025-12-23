const express = require('express');
const router = express.Router();
const conferenceController = require('../controllers/conferenceController');
const conferenceTemplateController = require('../controllers/conferenceTemplateController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// --- Conference Template Routes (Specific Routes First) ---

// Public Template Routes
router.get('/template', conferenceTemplateController.getAllTemplates);
router.get('/template/:conferenceId', conferenceTemplateController.getTemplateByConferenceId);

// Admin Template Routes
router.post('/template', upload.fields([
    { name: 'organizer_image', maxCount: 1 },
    { name: 'organizer_logo', maxCount: 1 },
    { name: 'partner_image', maxCount: 1 },
    { name: 'venue_image', maxCount: 1 },
    { name: 'keynote_speaker_images', maxCount: 20 }
]), conferenceTemplateController.upsertTemplate); // Upsert (Create or Update)

router.put('/template/:conferenceId', upload.fields([
    { name: 'organizer_image', maxCount: 1 },
    { name: 'organizer_logo', maxCount: 1 },
    { name: 'partner_image', maxCount: 1 },
    { name: 'venue_image', maxCount: 1 },
    { name: 'keynote_speaker_images', maxCount: 20 }
]), conferenceTemplateController.updateTemplate);

router.delete('/template/:conferenceId', conferenceTemplateController.deleteTemplate);


// --- Conference Routes (Base Entity / Generic Routes Last) ---

// Public Conference Routes
router.get('/', conferenceController.getAllConferences);
router.get('/:id', conferenceController.getConferenceById);

// Admin Conference Routes
// Ensure you have valid middleware or comment out if testing without auth
router.post('/', conferenceController.addConference);
router.put('/:id', conferenceController.editConference);
router.delete('/:id', conferenceController.deleteConference);

module.exports = router;
