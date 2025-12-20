const express = require('express');
const router = express.Router();
const conferenceController = require('../controllers/conferenceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public Routes
router.get('/', conferenceController.getAllConferences);
router.get('/:id', conferenceController.getConferenceById);

// Admin Routes
router.post('/', authMiddleware, roleMiddleware, conferenceController.addConference);
router.put('/:id', authMiddleware, roleMiddleware, conferenceController.editConference);
router.delete('/:id', authMiddleware, roleMiddleware, conferenceController.deleteConference);

module.exports = router;
