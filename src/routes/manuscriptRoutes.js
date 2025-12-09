const express = require('express');
const router = express.Router();
const manuscriptController = require('../controllers/manuscriptController');
const manuscriptUpload = require('../middleware/manuscriptUploadMiddleware');

// Public route as per implied usage (anyone can submit?), or is it protected? 
// The user CURL request didn't strictly show auth headers but usually submission is guarded. 
// However, typically manuscript submission systems allow registration/submission in one go or public access. 
// Assuming PUBLIC for now based on context, can add authMiddleware later if needed.

router.post(
    '/',
    manuscriptUpload.fields([
        { name: 'manuscriptFile', maxCount: 1 },
        { name: 'signature', maxCount: 1 }
    ]),
    manuscriptController.submitManuscript
);

module.exports = router;
